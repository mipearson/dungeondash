import Map from "./map";
import Graphics from "../assets/Graphics";

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

  neighbours(): { [dir: string]: Tile | null } {
    return {
      n: this.map.tileAt(this.x, this.y - 1),
      s: this.map.tileAt(this.x, this.y + 1),
      w: this.map.tileAt(this.x - 1, this.y),
      e: this.map.tileAt(this.x + 1, this.y),
      nw: this.map.tileAt(this.x - 1, this.y - 1),
      ne: this.map.tileAt(this.x + 1, this.y - 1),
      sw: this.map.tileAt(this.x - 1, this.y + 1),
      se: this.map.tileAt(this.x + 1, this.y + 1)
    };
  }

  wallIndex() {
    const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

    const neighbours = this.neighbours();

    const lookup = directions
      .filter(
        dir => !neighbours[dir] || neighbours[dir]!.type === TileType.Wall
      )
      .join("_");

    if (!Graphics.dungeon.indices.walls[lookup]) {
      console.log(`could not find index for ${lookup}`);
      return Graphics.dungeon.indices.walls.nil;
    }
    return Graphics.dungeon.indices.walls[lookup];
  }
}
