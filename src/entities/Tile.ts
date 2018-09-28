import Map from "./map";

export enum TileType {
  None,
  Wall,
  Door
}

export default class Tile {
  public readonly collides: boolean;
  public readonly type: TileType;
  public readonly map: Map;
  public readonly x: number;
  public readonly y: number;

  constructor(type: TileType, x: number, y: number, map: Map) {
    this.type = type;
    this.collides = type !== TileType.None;
    this.map = map;
    this.x = x;
    this.y = y;
  }

  isWall(): boolean {
    return this.type === TileType.Wall;
  }

  neighbours(): Array<Tile | null> {
    return [
      this.n(),
      this.ne(),
      this.e(),
      this.se(),
      this.s(),
      this.sw(),
      this.w(),
      this.nw()
    ];
  }

  n() {
    return this.map.tileAt(this.x, this.y - 1);
  }
  s() {
    return this.map.tileAt(this.x, this.y + 1);
  }
  w() {
    return this.map.tileAt(this.x - 1, this.y);
  }
  e() {
    return this.map.tileAt(this.x + 1, this.y);
  }
  nw() {
    return this.map.tileAt(this.x - 1, this.y - 1);
  }
  ne() {
    return this.map.tileAt(this.x + 1, this.y - 1);
  }
  sw() {
    return this.map.tileAt(this.x - 1, this.y + 1);
  }
  se() {
    return this.map.tileAt(this.x + 1, this.y + 1);
  }
}
