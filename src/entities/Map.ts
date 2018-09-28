import Tile, { TileType } from "../entities/Tile";
import DungeonFactory from "dungeon-factory";

export default class Map {
  public readonly tiles: Array<Array<Tile>>;
  public readonly width: number;
  public readonly height: number;

  constructor(width: number, height: number) {
    const dungeon = DungeonFactory.generate({
      width: width,
      height: height
    }) as { tiles: Array<Array<{ type: string }>> };
    this.width = width;
    this.height = height;

    this.tiles = [];
    for (let y = 0; y < height; y++) {
      this.tiles.push([]);
      for (let x = 0; x < width; x++) {
        this.tiles[y][x] = new Tile(
          dungeon.tiles[y][x].type === "wall" ? TileType.Wall : TileType.None,
          x,
          y,
          this
        );
      }
    }
  }
}
