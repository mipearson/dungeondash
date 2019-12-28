import Map from "./map";
import Graphics from "../assets/Graphics";

export enum TileType {
  None,
  Wall,
  Door
}

export default class Tile {
  public collides: boolean;
  public readonly type: TileType;
  public readonly map: Map;
  public readonly x: number;
  public readonly y: number;
  public seen: boolean;
  public desiredAlpha: number; // TODO: Move out of this class, specific to FOV
  public readonly corridor: boolean;

  public static tileTypeFor(type: string): TileType {
    if (type === "wall") {
      return TileType.Wall;
    } else if (type === "door") {
      return TileType.Door;
    } else {
      return TileType.None;
    }
  }

  constructor(type: TileType, x: number, y: number, map: Map) {
    this.type = type;
    this.collides = type !== TileType.None;
    this.map = map;
    this.x = x;
    this.y = y;
    this.seen = false;
    this.desiredAlpha = 1;
    this.corridor = !map.withinRoom(x, y);
  }

  open() {
    this.collides = false;
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

  isEnclosed(): boolean {
    return (
      Object.values(this.neighbours()).filter(
        t => !t || (t.type === TileType.Wall && t.corridor === this.corridor)
      ).length === 8
    );
  }

  spriteIndex(): number {
    const modifier = this.type === TileType.Wall && this.corridor ? 8 : 0;
    return this.rawIndex() + modifier;
  }

  // prettier-ignore
  private rawIndex(): number {
    const neighbours = this.neighbours();

    const n = neighbours.n && neighbours.n.type === TileType.Wall && neighbours.n.corridor === this.corridor;
    const s = neighbours.s && neighbours.s.type === TileType.Wall && neighbours.s.corridor === this.corridor
    const w = neighbours.w && neighbours.w.type === TileType.Wall && neighbours.w.corridor === this.corridor
    const e = neighbours.e && neighbours.e.type === TileType.Wall && neighbours.e.corridor === this.corridor

    const wDoor = neighbours.w && neighbours.w.type === TileType.Door;
    const eDoor = neighbours.e && neighbours.e.type === TileType.Door;

    const i = Graphics.environment.indices.walls;

    if (this.type === TileType.Wall) {
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

      if (w && eDoor) { return i.intersections.e_door; }
      if (e && wDoor) { return i.intersections.w_door; }

      if (n) { return i.intersections.n; }
      if (s) { return i.intersections.s; }
      if (e) { return i.intersections.e; }
      if (w) { return i.intersections.w; }

      return i.alone;
    }

    if (this.type === TileType.Door) {
      if (n || s) {
        return Graphics.environment.indices.doors.vertical
      } else {
        return Graphics.environment.indices.doors.horizontal;
      }
    }

    return 0;
  }
}
