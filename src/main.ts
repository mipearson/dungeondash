import Phaser from "phaser";
import RogueDungeon from "../assets/RogueDungeon.png";
import RoguePlayer from "../assets/RoguePlayer.png";
import DungeonFactory from "dungeon-factory";
import Mrpas from "mrpas";

const width = 61;
const height = 40;

const tileSize = 16;

const Tiles = {
  World: {
    Black: 0x60,
    Wall: {
      Brown: {
        Horizontal: [0x10, 0x10, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15],
        Vertical: [0x16, 0x16, 0x17, 0x18, 0x19]
      }
    },
    Floor: {
      Dirt: [0x50, 0x51, 0x52, 0x53, 0x54, 0x55],
      Stone: [0x40, 0x40, 0x40, 0x41, 0x42, 0x43, 0x44, 0x45]
    },
    Door: {
      Stone: {
        Horizontal: 0xb0,
        Vertical: 0xb2
      }
    }
  },
  Monsters: {
    Fighter: [0x00, 0x01, 0x02, 0x03, 0x10, 0x11, 0x12, 0x13]
  }
};

function randomTile(tiles: Array<number>): number {
  return tiles[Math.floor(Math.random() * tiles.length)];
}

class DungeonScene extends Phaser.Scene {
  sprite: Phaser.Physics.Arcade.Sprite | null;
  keys: Phaser.Input.Keyboard.CursorKeys | null;

  lastX: number;
  lastY: number;

  preload(): void {
    this.load.image("dungeon", RogueDungeon);
    this.load.spritesheet("player", RoguePlayer, {
      frameHeight: tileSize,
      frameWidth: 16
    });
  }

  constructor() {
    super("Scene");
    this.sprite = null;
    this.keys = null;
    this.lastX = -1;
    this.lastY = -1;
  }

  create(): void {
    const dungeon = DungeonFactory.generate({
      width: height,
      height: width
    }) as { tiles: Array<Array<any>> };

    console.log(dungeon);

    const walls = dungeon.tiles.map(row =>
      row.map(tile => tile.type === "wall")
    );

    const map = this.make.tilemap({
      tileWidth: tileSize,
      tileHeight: tileSize,
      width: width,
      height: height
    });

    const tiles = map.addTilesetImage("dungeon");
    const groundLayer = map
      .createBlankDynamicLayer("Ground", tiles, 0, 0)
      .randomize(0, 0, width, height, Tiles.World.Floor.Stone);
    const wallLayer = map.createBlankDynamicLayer("Wall", tiles, 0, 0);
    const darkLayer = map
      .createBlankDynamicLayer("Dark", tiles, 0, 0)
      .fill(Tiles.World.Black);
    this.darkLayer = darkLayer;

    const fov = new Mrpas(width, height, (x: number, y: number) => {
      return walls[y] && !walls[y][x];
    });
    this.fov = fov;

    let firstPos = [0, 0];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const tile = dungeon.tiles[y][x] as any;
        if (tile.type === "wall") {
          let idx = 0;
          if (tile.nesw.east && tile.nesw.east.type !== "wall") {
            idx = randomTile(Tiles.World.Wall.Brown.Horizontal);
          } else {
            idx = randomTile(Tiles.World.Wall.Brown.Vertical);
          }
          wallLayer.putTileAt(idx, x, y);
        } else if (firstPos !== [0, 0]) {
          firstPos = [x, y];
        }
      }
    }

    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(2);

    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [Tiles.Monsters.Fighter[0], Tiles.Monsters.Fighter[4]]
      }),
      frameRate: 8,
      repeat: -1
    });

    this.sprite = this.physics.add.sprite(
      firstPos[0] * tileSize + tileSize / 2,
      firstPos[1] * tileSize + tileSize / 2,
      "player",
      0
    );

    this.cameras.main.setBounds(0, 0, width * tileSize, height * tileSize);
    this.cameras.main.startFollow(this.sprite);

    this.keys = this.input.keyboard.createCursorKeys();

    wallLayer.setCollisionBetween(0, 256);
    this.physics.add.collider(this.sprite, wallLayer);
    this.sprite.setSize(10, 10);
    this.sprite.setOffset(3, 6);
  }

  updateFov() {
    const x = Math.floor((this.sprite.body.x + tileSize / 2) / tileSize);
    const y = Math.floor((this.sprite.body.y + tileSize / 2) / tileSize);

    if (this.lastX == x && this.lastY == y) {
      return;
    }
    this.lastX = x;
    this.lastY = y;

    this.darkLayer.forEachTile(
      t => {
        t.alpha = t.alpha < 1 ? 0.7 : 1;
      },
      this,
      0,
      0,
      width,
      height
    );

    this.fov.compute(
      x,
      y,
      7,
      (x, y) => {
        return this.darkLayer.getTileAt(x, y).alpha < 1;
      },
      (x, y) => {
        this.darkLayer.getTileAt(x, y).alpha = 0;
      }
    );
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    if (!keys || !sprite) {
      return;
    }
    const speed = 150;
    const prevVelocity = sprite.body.velocity.clone();

    // Stop any previous movement from the last frame
    sprite.body.setVelocity(0);

    // Horizontal movement
    if (keys.left.isDown) {
      sprite.body.setVelocityX(-speed);
    } else if (keys.right.isDown) {
      sprite.body.setVelocityX(speed);
    }

    // Vertical movement
    if (keys.up.isDown) {
      sprite.body.setVelocityY(-speed);
    } else if (keys.down.isDown) {
      sprite.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(speed);

    this.updateFov();
  }
}

class InfoScene extends Phaser.Scene {
  constructor() {
    super({ key: "InfoScene", active: true });
  }

  create(): void {
    const content = [
      "Phaser 3 tilemap & FOV experiment.",
      "",
      "Use arrow keys to walk around the map!",
      "",
      "Dungeon generation via npmjs.com/package/dungeon-factory",
      "FOV calculation via npmjs.com/package/mrpas",
      "Tileset https://www.oryxdesignlab.com/products/tiny-dungeon-tileset"
    ];
    const text = this.add.text(25, 25, content, {
      fontFamily: "sans-serif",
      color: "#ffffff"
    });
    text.setAlpha(0.9);
  }
}

class ReferenceScene extends Phaser.Scene {
  preload(): void {
    this.load.image("tiles", RogueDungeon);
  }

  create(): void {
    let level: Array<Array<number>> = [];
    for (let y = 0; y < 16; y++) {
      level[y] = [];
      for (let x = 0; x < 8; x++) {
        const idx = y * 8 + x;
        level[y][x] = idx;
        const text = this.add.text(x * 32, y * 32, idx.toString(16), {
          fontSize: 14
        });
        text.setDepth(10);
      }
    }

    const map = this.make.tilemap({
      data: level,
      tileWidth: tileSize,
      tileHeight: tileSize
    });
    const tiles = map.addTilesetImage("tiles");
    const layer = map.createStaticLayer(0, tiles, 0, 0);
    layer.setScale(2);
  }
}

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  width: width * tileSize,
  height: height * tileSize,
  render: { pixelArt: true },
  physics: { default: "arcade", arcade: { debug: false, gravity: { y: 0 } } },
  // scene: [DungeonScene, InfoScene]
  scene: [ReferenceScene]
});

function setUpHotReload() {
  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
    module.hot.accept(() => {});
    // @ts-ignore
    module.hot.dispose(() => {
      window.location.reload();
    });
  }
}

setUpHotReload();
