import Phaser from "phaser";
import Graphics from "../assets/Graphics";

const tilesets = [Graphics.dungeon, Graphics.player, Graphics.util];

export default class ReferenceScene extends Phaser.Scene {
  index: number;
  group: Phaser.GameObjects.Group | null;
  map: Phaser.Tilemaps.Tilemap | null;

  constructor() {
    super("ReferenceScene");
    this.index = 0;
    this.group = null;
    this.map = null;
  }

  preload(): void {
    tilesets.forEach(t => this.load.image(t.name, t.file));
  }

  create(): void {
    this.previewTileset();
    this.input.keyboard.on("keydown_N", () => {
      this.index += 1;
      if (this.index >= tilesets.length) {
        this.index = 0;
      }
      this.reset();
      this.previewTileset();
    });
  }

  reset() {
    this.group && this.group.clear(true, true);
    this.map && this.map.destroy();
    this.group = null;
    this.map = null;
  }

  previewTileset() {
    this.group = this.add.group();
    const tileset = tilesets[this.index];

    this.map = this.make.tilemap({
      tileWidth: tileset.width,
      tileHeight: tileset.height
    });
    const tiles = this.map.addTilesetImage(tileset.name);
    const layer = this.map.createBlankDynamicLayer("preview", tiles, 0, 0);

    for (let y = 0; y < tiles.rows; y++) {
      for (let x = 0; x < tiles.columns; x++) {
        const idx = y * tiles.columns + x;
        const text = this.add.text(
          x * tileset.width * 2,
          y * tileset.height * 2,
          idx.toString(16),
          {
            fontSize: 14
          }
        );
        text.setDepth(10);
        this.group.add(text);
        layer.putTileAt(idx, x, y);
      }
    }

    layer.setScale(2);
    this.group.add(layer);
  }
}
