import Tiles from "../assets/Graphics";
import Mrpas from "mrpas";

const radius = 7;

export default class FOV {
  private layer: Phaser.Tilemaps.DynamicTilemapLayer;
  private mrpas: any;
  private lastX: number;
  private lastY: number;
  private width: number;
  private height: number;

  constructor(
    width: number,
    height: number,
    walls: Array<Array<boolean>>,
    map: Phaser.Tilemaps.Tilemap
  ) {
    const utilTiles = map.addTilesetImage("util");

    this.layer = map
      .createBlankDynamicLayer("Dark", utilTiles, 0, 0)
      .fill(Tiles.util.indices.black);

    this.mrpas = new Mrpas(width, height, (x: number, y: number) => {
      return walls[y] && !walls[y][x];
    });

    this.lastX = -1;
    this.lastY = -1;

    this.width = width;
    this.height = height;
  }

  update(tileX: number, tileY: number) {
    if (this.lastX == tileX && this.lastY == tileY) {
      return;
    }
    this.lastX = tileX;
    this.lastY = tileY;

    this.layer.forEachTile(
      (t: Phaser.Tilemaps.Tile) => {
        t.alpha = t.alpha < 1 ? 0.7 : 1;
      },
      this,
      0,
      0,
      this.width,
      this.height
    );

    this.mrpas.compute(
      tileX,
      tileY,
      radius,
      (x: number, y: number) => {
        return this.layer.getTileAt(x, y).alpha < 1;
      },
      (x: number, y: number) => {
        this.layer.getTileAt(x, y).alpha = 0;
      }
    );
  }
}
