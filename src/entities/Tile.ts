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
}
