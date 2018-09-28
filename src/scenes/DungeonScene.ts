import Phaser from "phaser";
import Tiles from "../assets/Graphics";
import FOVLayer from "../entities/FOVLayer";
import Player from "../entities/Player";
import { generateDungeon } from "../lib/DungeonGenerator";

const worldTileHeight = 81;
const worldTileWidth = 81;

export default class DungeonScene extends Phaser.Scene {
  lastX: number;
  lastY: number;
  player: Player | null;
  fov: FOVLayer | null;
  map: Phaser.Tilemaps.Tilemap | null;

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
    this.lastX = -1;
    this.lastY = -1;
    this.player = null;
    this.fov = null;
    this.map = null;
  }

  create(): void {
    const tiles = generateDungeon(worldTileWidth, worldTileHeight);
    console.log(tiles);

    this.map = this.make.tilemap({
      tileWidth: Tiles.dungeon.width,
      tileHeight: Tiles.dungeon.height,
      width: worldTileWidth,
      height: worldTileHeight
    });

    const dungeonTiles = this.map.addTilesetImage("dungeon");

    this.map
      .createBlankDynamicLayer("Ground", dungeonTiles, 0, 0)
      .randomize(
        0,
        0,
        worldTileWidth,
        worldTileHeight,
        Tiles.dungeon.indices.floor.outer
      );
    const wallLayer = this.map.createBlankDynamicLayer(
      "Wall",
      dungeonTiles,
      0,
      0
    );

    this.fov = new FOVLayer(worldTileWidth, worldTileHeight, tiles, this.map);

    let firstPos = [0, 0];
    for (let x = 0; x < worldTileWidth; x++) {
      for (let y = 0; y < worldTileHeight; y++) {
        const tile = tiles[y][x];
        if (tile.isWall()) {
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

    this.player = new Player(
      this.map.tileToWorldX(firstPos[0]),
      this.map.tileToWorldX(firstPos[1]),
      this
    );

    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(
      0,
      0,
      worldTileWidth * Tiles.dungeon.width,
      worldTileHeight * Tiles.dungeon.height
    );
    this.cameras.main.startFollow(this.player.sprite);

    wallLayer.setCollisionBetween(0, 256);
    this.physics.add.collider(this.player.sprite, wallLayer);
  }

  update() {
    this.player!.update();

    const playerX = this.map!.worldToTileX(this.player!.sprite.x);
    const playerY = this.map!.worldToTileY(this.player!.sprite.y);

    this.fov!.update(playerX, playerY);
  }
}
