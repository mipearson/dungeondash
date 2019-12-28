import Phaser from "phaser";
import Graphics from "../assets/Graphics";
import Fonts from "../assets/Fonts";

const tilesets = Object.values(Graphics);

export default class ReferenceScene extends Phaser.Scene {
  index: number;
  group: Phaser.GameObjects.Group | null;
  map: Phaser.Tilemaps.Tilemap | null;
  title: Phaser.GameObjects.DynamicBitmapText | null;

  constructor() {
    super("ReferenceScene");
    this.index = 0;
    this.group = null;
    this.map = null;
    this.title = null;
  }

  preload(): void {
    tilesets.forEach(t => this.load.image(t.name, t.file));
    this.load.bitmapFont("default", ...Fonts.default);
  }

  create(): void {
    this.title = this.add.dynamicBitmapText(20, 10, "default", "", 12);
    this.previewTileset();
    this.input.keyboard.on("keydown_N", () => {
      this.index += 1;
      if (this.index >= tilesets.length) {
        this.index = 0;
      }
      this.reset();
      this.previewTileset();
    });

    this.input.keyboard.on("keydown_R", () => {
      this.scene.wake("DungeonScene");
      this.scene.stop();
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
    const layer = this.map.createBlankDynamicLayer(
      "preview",
      tiles,
      30,
      40,
      tiles.columns,
      tiles.rows
    );
    layer.setScale(tileset.width > 32 ? 2 : 3);

    const grid = this.add
      .grid(
        layer.x + layer.displayWidth / 2,
        layer.y + layer.displayHeight / 2,
        layer.displayWidth + 16,
        layer.displayHeight + 16,
        8,
        8,
        0x222222
      )
      .setAltFillStyle(0x2a2a2a)
      .setOutlineStyle();
    layer.setDepth(5);
    this.group.add(grid);

    for (let y = 0; y < tiles.rows; y++) {
      for (let x = 0; x < tiles.columns; x++) {
        const idx = y * tiles.columns + x;
        const text = this.add.bitmapText(
          this.map.tileToWorldX(x),
          this.map.tileToWorldY(y),
          "default",
          idx.toString(16),
          6
        );
        text.setDepth(10);
        this.group.add(text);
        layer.putTileAt(idx, x, y);
      }
    }

    this.group.add(layer);

    this.title!.setText(
      `'${tileset.name}' (${this.index + 1} of ${
        tilesets.length
      }) ['n' for next]`
    );
  }
}
