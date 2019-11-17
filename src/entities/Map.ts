import DungeonFactory from "dungeon-factory";

import Tile, { TileType } from "./Tile";
import Slime from "./Slime";
import Graphics from "../assets/Graphics";
import DungeonScene from "../scenes/DungeonScene";

interface DungeonFactoryRoom {
  height: number;
  width: number;
  x: number;
  y: number;
  getBoundingBox: () => {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
}

interface DungeonFactoryOutput {
  tiles: { type: string }[][];
  rooms: DungeonFactoryRoom[];
}

export default class Map {
  public readonly tiles: Tile[][];
  public readonly width: number;
  public readonly height: number;
  public readonly tilemap: Phaser.Tilemaps.Tilemap;
  public readonly wallLayer: Phaser.Tilemaps.StaticTilemapLayer;
  public readonly doorLayer: Phaser.Tilemaps.DynamicTilemapLayer;

  public readonly startingX: number;
  public readonly startingY: number;

  public readonly slimes: Slime[];

  public readonly rooms: DungeonFactoryRoom[];

  constructor(width: number, height: number, scene: DungeonScene) {
    const dungeon = DungeonFactory.generate({
      width: width,
      height: height
    }) as DungeonFactoryOutput;
    this.rooms = dungeon.rooms;
    console.log(this.rooms);

    this.width = width;
    this.height = height;

    this.tiles = [];
    for (let y = 0; y < height; y++) {
      this.tiles.push([]);
      for (let x = 0; x < width; x++) {
        const tileType = Tile.tileTypeFor(dungeon.tiles[x][y].type);
        this.tiles[y][x] = new Tile(tileType, x, y, this);
      }
    }

    const toReset = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = this.tiles[y][x];
        if (tile.type === TileType.Wall && tile.isEnclosed()) {
          toReset.push({ y: y, x: x });
        }
      }
    }

    toReset.forEach(d => {
      this.tiles[d.y][d.x] = new Tile(TileType.None, d.x, d.y, this);
    });

    const roomNumber = Math.floor(Math.random() * dungeon.rooms.length);

    const firstRoom = dungeon.rooms[roomNumber];
    this.startingX = Math.floor(firstRoom.x + firstRoom.width / 2);
    this.startingY = Math.floor(firstRoom.y + firstRoom.height / 2);

    this.tilemap = scene.make.tilemap({
      tileWidth: Graphics.environment.width,
      tileHeight: Graphics.environment.height,
      width: width,
      height: height
    });

    const dungeonTiles = this.tilemap.addTilesetImage(
      Graphics.environment.name
    );

    const groundLayer = this.tilemap
      .createBlankDynamicLayer("Ground", dungeonTiles, 0, 0)
      .randomize(
        0,
        0,
        this.width,
        this.height,
        Graphics.environment.indices.floor.outerCorridor
      );
    this.doorLayer = this.tilemap.createBlankDynamicLayer(
      "Door",
      dungeonTiles,
      0,
      0
    );
    const wallLayer = this.tilemap.createBlankDynamicLayer(
      "Wall",
      dungeonTiles,
      0,
      0
    );

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const tile = this.tiles[y][x];
        if (tile.type === TileType.Wall) {
          wallLayer.putTileAt(tile.spriteIndex(), x, y);
        } else if (tile.type === TileType.Door) {
          this.doorLayer.putTileAt(tile.spriteIndex(), x, y);
        }
      }
    }
    wallLayer.setCollisionBetween(0, 0x7f);
    const collidableDoors = [
      Graphics.environment.indices.doors.horizontal,
      Graphics.environment.indices.doors.vertical
    ];
    this.doorLayer.setCollision(collidableDoors);

    this.doorLayer.setTileIndexCallback(
      collidableDoors,
      (_: unknown, tile: Phaser.Tilemaps.Tile) => {
        this.doorLayer.putTileAt(
          Graphics.environment.indices.doors.destroyed,
          tile.x,
          tile.y
        );
        this.tileAt(tile.x, tile.y)!.open();
        scene.fov!.recalculate();
      },
      this
    );

    this.wallLayer = this.tilemap.convertLayerToStatic(wallLayer);

    this.slimes = [];

    for (let room of dungeon.rooms) {
      groundLayer.randomize(
        room.x - 1,
        room.y - 1,
        room.width + 2,
        room.height + 2,
        Graphics.environment.indices.floor.outer
      );

      if (room.height < 4 || room.width < 4) {
        continue;
      }

      const roomTL = this.tilemap.tileToWorldXY(room.x + 1, room.y + 1);
      const roomBounds = this.tilemap.tileToWorldXY(
        room.x + room.width - 1,
        room.y + room.height - 1
      );
      const numSlimes = Phaser.Math.Between(1, 3);
      for (let i = 0; i < numSlimes; i++) {
        this.slimes.push(
          new Slime(
            Phaser.Math.Between(roomTL.x, roomBounds.x),
            Phaser.Math.Between(roomTL.y, roomBounds.y),
            scene
          )
        );
      }
    }

    // TODO
    // this.tilemap.convertLayerToStatic(groundLayer);
  }

  tileAt(x: number, y: number): Tile | null {
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
      return null;
    }
    return this.tiles[y][x];
  }

  withinRoom(x: number, y: number): boolean {
    // x = x + 1; // Dungeon rooms are offset by one.
    // y = y + 1;
    return (
      this.rooms.find(r => {
        const { top, left, right, bottom } = r.getBoundingBox();
        return y >= top - 1 && y <= bottom && x >= left - 1 && x <= right;
      }) != undefined
    );
  }
}
