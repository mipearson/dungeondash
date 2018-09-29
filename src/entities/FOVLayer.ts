import Graphics from "../assets/Graphics";
import Tile from "../entities/Tile";
import Mrpas from "mrpas";
import Phaser from "phaser";

const radius = 7;
const fogAlpha = 0.8;

const lightDropoff = [0.7, 0.6, 0.3, 0.1];

export default class FOVLayer {
  public layer: Phaser.Tilemaps.DynamicTilemapLayer;
  private mrpas: any;
  private lastX: number;
  private lastY: number;
  private width: number;
  private height: number;

  constructor(
    width: number,
    height: number,
    walls: Array<Array<Tile>>,
    map: Phaser.Tilemaps.Tilemap
  ) {
    const utilTiles = map.addTilesetImage("util");

    this.layer = map
      .createBlankDynamicLayer("Dark", utilTiles, 0, 0)
      .fill(Graphics.util.indices.black);

    this.mrpas = new Mrpas(width, height, (x: number, y: number) => {
      return walls[y] && !walls[y][x].collides;
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
        t.alpha = t.alpha < 1 ? fogAlpha : 1;
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
        const distance = Math.floor(
          new Phaser.Math.Vector2(x, y).distance(
            new Phaser.Math.Vector2(tileX, tileY)
          )
        );

        const rolloffIdx = distance <= radius ? radius - distance : 0;
        const alpha =
          rolloffIdx < lightDropoff.length ? lightDropoff[rolloffIdx] : 0;
        this.layer.getTileAt(x, y).alpha = alpha;
      }
    );
  }
}
