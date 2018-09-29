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

  // prettier-ignore
  wallIndex() {
    const neighbours = this.neighbours();

    const n = !neighbours.n || neighbours.n.type === TileType.Wall;
    const s = !neighbours.s || neighbours.s.type === TileType.Wall;
    const w = !neighbours.w || neighbours.w.type === TileType.Wall;
    const e = !neighbours.e || neighbours.e.type === TileType.Wall;
    const nw = !neighbours.nw || neighbours.nw.type === TileType.Wall;
    const ne = !neighbours.ne || neighbours.ne.type === TileType.Wall;
    const sw = !neighbours.sw || neighbours.sw.type === TileType.Wall;
    const se = !neighbours.se || neighbours.se.type === TileType.Wall;

    const i = Graphics.dungeon.indices.walls;
    
    if (n && ne && e && se && s && sw && w && nw) { return i.enclosed; }

    if (n && ne && e && s && sw && w && nw) { return i.edges.inner.se; }
    if (n && ne && e && se && s && w && nw) { return i.edges.inner.sw; }
    if (n && e && se && s && sw && w && nw) { return i.edges.inner.ne; }
    if (n && ne && e && se && s && sw && w) { return i.edges.inner.nw; }
    
    if (e && s && w && (se || sw)) { return i.edges.outer.n; }
    if (n && s && w && (nw || sw)) { return i.edges.outer.e; }
    if (n && e && w && (ne || nw)) { return i.edges.outer.s; }
    if (n && e && s && (ne || se)) { return i.edges.outer.w; }

    if (e && se && s) { return i.edges.outer.nw; }
    if (s && sw && w) { return i.edges.outer.ne; }
    if (n && w && nw) { return i.edges.outer.se; }
    if (n && ne && e) { return i.edges.outer.sw; }

    if (n && e && s && w) { return i.intersections.n_e_s_w; }
    if (n && e && s) { return i.intersections.n_e_s; }
    if (n && s && w) { return i.intersections.n_s_w; }
    if (e && s && w) { return i.intersections.e_s_w; }
    if (n && e && w) { return i.intersections.n_e_w; }

    if (e && s) { return i.intersections.e_s; }
    if (e && w) { return i.intersections.e_w; }
    if (s && w) { return i.intersections.s_w; }
    if (n && s) { return i.intersections.n_s; }
    if (n && e) { return i.intersections.n_e; }
    if (n && w) { return i.intersections.n_w; }

    if (n) { return i.intersections.n; }
    if (s) { return i.intersections.s; }
    if (e) { return i.intersections.e; }
    if (w) { return i.intersections.w; }

    return i.alone;
  }
}
