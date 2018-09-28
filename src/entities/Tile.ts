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
    const neighbours = this.neighbours();

    const walls = {
        n: !neighbours.n || neighbours.n.type === TileType.Wall,
        s: !neighbours.s || neighbours.s.type === TileType.Wall,
        w: !neighbours.w || neighbours.w.type === TileType.Wall,
        e: !neighbours.e || neighbours.e.type === TileType.Wall,
        nw: !neighbours.nw || neighbours.nw.type === TileType.Wall,
        ne: !neighbours.ne || neighbours.ne.type === TileType.Wall,
        sw: !neighbours.sw || neighbours.sw.type === TileType.Wall,
        se: !neighbours.se || neighbours.se.type === TileType.Wall
    } 

    const i = Graphics.dungeon.indices.walls;

    if 
    // const lookup = directions
    //   .filter(
    //     dir => !neighbours[dir] || neighbours[dir]!.type === TileType.Wall
    //   )
    //   .join("_");

    // if (!Graphics.dungeon.indices.walls[lookup]) {
    //   console.log(`could not find index for ${lookup}`);
    //   return Graphics.dungeon.indices.walls.nil;
    // }
    // return Graphics.dungeon.indices.walls[lookup];

    return i.alone;
  }
}
