import Graphics from "../assets/Graphics";
import Map from "../entities/Map";
import Mrpas from "mrpas";
import Phaser from "phaser";

const radius = 7;
const fogAlpha = 0.8;

const lightDropoff = [0.7, 0.6, 0.3, 0.1];

export default class FOVLayer {
  public layer: Phaser.Tilemaps.DynamicTilemapLayer;
  private mrpas: any;
  private lastPos: Phaser.Math.Vector2;
  private map: Map;

  constructor(map: Map) {
    const utilTiles = map.tilemap.addTilesetImage("util");

    this.layer = map.tilemap
      .createBlankDynamicLayer("Dark", utilTiles, 0, 0)
      .fill(Graphics.util.indices.black);

    this.mrpas = new Mrpas(map.width, map.height, (x: number, y: number) => {
      return map.tiles[y] && !map.tiles[y][x].collides;
    });

    this.lastPos = new Phaser.Math.Vector2({ x: -1, y: -1 });
    this.map = map;
  }

  update(
    pos: Phaser.Math.Vector2,
    bounds: { nw: Phaser.Math.Vector2; se: Phaser.Math.Vector2 },
    delta: number
  ) {
    if (this.lastPos.equals(pos)) {
      return;
    }
    this.lastPos = pos.clone();

    this.layer.forEachTile(
      (t: Phaser.Tilemaps.Tile) => {
        t.alpha = t.alpha < 1 ? fogAlpha : 1;
      },
      this,
      0,
      0,
      this.map.width,
      this.map.height
    );

    this.mrpas.compute(
      pos.x,
      pos.y,
      radius,
      (x: number, y: number) => {
        return this.layer.getTileAt(x, y).alpha < 1;
      },
      (x: number, y: number) => {
        const distance = Math.floor(
          new Phaser.Math.Vector2(x, y).distance(
            new Phaser.Math.Vector2(pos.x, pos.y)
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
