import Phaser from "phaser";
import Tiles from "../assets/Graphics";
import FOVLayer from "../entities/FOVLayer";
import Player from "../entities/Player";
import Map from "../entities/Map";

const worldTileHeight = 81;
const worldTileWidth = 81;

export default class DungeonScene extends Phaser.Scene {
  lastX: number;
  lastY: number;
  player: Player | null;
  fov: FOVLayer | null;
  tilemap: Phaser.Tilemaps.Tilemap | null;

  preload(): void {
    this.load.image("dungeon", Tiles.dungeon.file);
    this.load.image("util", Tiles.util.file);
    this.load.spritesheet("player", Tiles.player.file, {
      frameHeight: Tiles.player.height,
      frameWidth: Tiles.player.width
    });
  }

  constructor() {
    super("Scene");
    this.lastX = -1;
    this.lastY = -1;
    this.player = null;
    this.fov = null;
    this.tilemap = null;
  }

  create(): void {
    const map = new Map(worldTileWidth, worldTileHeight, this);
    this.tilemap = map.tilemap;

    this.fov = new FOVLayer(map);

    this.player = new Player(
      this.tilemap.tileToWorldX(map.startingX),
      this.tilemap.tileToWorldY(map.startingY),
      this
    );

    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(
      0,
      0,
      map.width * Tiles.dungeon.width,
      map.height * Tiles.dungeon.height
    );
    this.cameras.main.startFollow(this.player.sprite);

    this.physics.add.collider(this.player.sprite, map.wallLayer);
  }

  update(time: number, delta: number) {
    this.player!.update(time);
    const camera = this.cameras.main;

    const player = new Phaser.Math.Vector2({
      x: this.tilemap!.worldToTileX(this.player!.sprite.x),
      y: this.tilemap!.worldToTileY(this.player!.sprite.y)
    });

    const boundsNW = new Phaser.Math.Vector2({
      x: this.tilemap!.worldToTileX(camera.x),
      y: this.tilemap!.worldToTileY(camera.y)
    });

    const boundsSE = new Phaser.Math.Vector2({
      x: this.tilemap!.worldToTileX(camera.x + camera.width),
      y: this.tilemap!.worldToTileY(camera.y + camera.height)
    });

    this.fov!.update(player, { nw: boundsNW, se: boundsSE }, delta);
  }
}
