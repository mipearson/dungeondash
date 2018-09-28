import Phaser from "phaser";
import Tiles from "../Tiles";

const tileset = Tiles.dungeon;

export default class ReferenceScene extends Phaser.Scene {
  preload(): void {
    this.load.image("tiles", tileset.file);
  }

  create(): void {
    let level: Array<Array<number>> = [];
    for (let y = 0; y < 16; y++) {
      level[y] = [];
      for (let x = 0; x < 8; x++) {
        const idx = y * 8 + x;
        level[y][x] = idx;
        const text = this.add.text(
          x * tileset.width * 2,
          y * tileset.height * 2,
          idx.toString(16),
          {
            fontSize: 14
          }
        );
        text.setDepth(10);
      }
    }

    const map = this.make.tilemap({
      data: level,
      tileWidth: tileset.width,
      tileHeight: tileset.height
    });
    const tiles = map.addTilesetImage("tiles");
    const layer = map.createStaticLayer(0, tiles, 0, 0);
    layer.setScale(2);
  }
}
