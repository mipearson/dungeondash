import DungeonFactory from "dungeon-factory";
import Tile, { TileType } from "../entities/Tile";

export function generateDungeon(
  width: number,
  height: number
): Array<Array<Tile>> {
  const dungeon = DungeonFactory.generate({
    width: width,
    height: height
  }) as { tiles: Array<Array<any>> };

  return dungeon.tiles.map(row =>
    row.map(
      tile => new Tile(tile.type === "wall" ? TileType.Wall : TileType.None)
    )
  );
}
