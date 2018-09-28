import Phaser from "phaser";
import Tiles from "../Tiles";
import DungeonFactory from "dungeon-factory";
import Mrpas from "mrpas";

const worldHeight = 81;
const worldWidth = 81;

export default class DungeonScene extends Phaser.Scene {
  sprite: Phaser.Physics.Arcade.Sprite | null;
  keys: Phaser.Input.Keyboard.CursorKeys | null;

  lastX: number;
  lastY: number;

  preload(): void {
    this.load.image("dungeon", Tiles.dungeon.file);
    this.load.image("util", Tiles.util.file);
    this.load.spritesheet("player", Tiles.player.file, {
      frameHeight: Tiles.player.height,
      frameWidth: Tiles.player.width
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
      width: worldWidth,
      height: worldHeight
    }) as { tiles: Array<Array<any>> };

    console.log(dungeon);

    const walls = dungeon.tiles.map(row =>
      row.map(tile => tile.type === "wall")
    );

    const map = this.make.tilemap({
      tileWidth: Tiles.dungeon.width,
      tileHeight: Tiles.dungeon.height,
      width: worldWidth,
      height: worldHeight
    });

    const dungeonTiles = map.addTilesetImage("dungeon");
    const utilTiles = map.addTilesetImage("util");

    const groundLayer = map
      .createBlankDynamicLayer("Ground", dungeonTiles, 0, 0)
      .randomize(
        0,
        0,
        worldWidth,
        worldHeight,
        Tiles.dungeon.indices.floor.outer
      );
    const wallLayer = map.createBlankDynamicLayer("Wall", dungeonTiles, 0, 0);
    const darkLayer = map
      .createBlankDynamicLayer("Dark", utilTiles, 0, 0)
      .fill(Tiles.util.indices.black);
    this.darkLayer = darkLayer;

    const fov = new Mrpas(worldWidth, worldHeight, (x: number, y: number) => {
      return walls[y] && !walls[y][x];
    });
    this.fov = fov;

    let firstPos = [0, 0];
    for (let x = 0; x < worldWidth; x++) {
      for (let y = 0; y < worldHeight; y++) {
        const tile = dungeon.tiles[y][x] as any;
        if (tile.type === "wall") {
          // let idx = 0;
          // if (tile.nesw.east && tile.nesw.east.type !== "wall") {
          //   idx = randomTile(Tiles.World.Wall.Brown.Horizontal);
          // } else {
          //   idx = randomTile(Tiles.World.Wall.Brown.Vertical);
          // }
          wallLayer.putTileAt(Tiles.dungeon.indices.block, x, y);
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
        frames: Tiles.player.indices.south
      }),
      frameRate: 8,
      repeat: -1
    });

    this.sprite = this.physics.add.sprite(
      firstPos[0] * Tiles.dungeon.width + Tiles.dungeon.width / 2,
      firstPos[1] * Tiles.dungeon.height + Tiles.dungeon.height / 2,
      "player",
      0
    );

    this.cameras.main.setBounds(
      0,
      0,
      worldWidth * Tiles.dungeon.width,
      worldHeight * Tiles.dungeon.height
    );
    this.cameras.main.startFollow(this.sprite);

    this.keys = this.input.keyboard.createCursorKeys();

    wallLayer.setCollisionBetween(0, 256);
    this.physics.add.collider(this.sprite, wallLayer);
    this.sprite.setSize(13, 12);
    this.sprite.setOffset(9, 16);
  }

  updateFov() {
    const x = Math.floor((this.sprite.body.x + 16 / 2) / 16);
    const y = Math.floor((this.sprite.body.y + 16 / 2) / 16);

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
      worldWidth,
      worldHeight
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
