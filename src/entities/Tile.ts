export enum TileType {
  None,
  Wall,
  Door
}

export default class Tile {
  public collides: boolean;
  public type: TileType;

  constructor(type: TileType) {
    this.type = type;
    this.collides = type !== TileType.None;
  }

  isWall(): boolean {
    return this.type === TileType.Wall;
  }
}
