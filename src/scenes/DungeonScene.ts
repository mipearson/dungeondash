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
  cameraResizeNeeded: boolean;

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
    this.cameraResizeNeeded = false;
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
    window.addEventListener("resize", () => {
      this.cameraResizeNeeded = true;
    });
  }

  update(time: number, delta: number) {
    this.player!.update(time);
    const camera = this.cameras.main;

    if (this.cameraResizeNeeded) {
      // Do this here rather than the resize callback as it limits
      // how much we'll slow down the game
      camera.setSize(window.innerWidth, window.innerHeight);
      this.cameraResizeNeeded = false;
    }

    const player = new Phaser.Math.Vector2({
      x: this.tilemap!.worldToTileX(this.player!.sprite.x),
      y: this.tilemap!.worldToTileY(this.player!.sprite.y)
    });

    const bounds = new Phaser.Geom.Rectangle(
      this.tilemap!.worldToTileX(camera.worldView.x) - 1,
      this.tilemap!.worldToTileY(camera.worldView.y) - 1,
      this.tilemap!.worldToTileX(camera.worldView.width) + 2,
      this.tilemap!.worldToTileX(camera.worldView.height) + 2
    );

    this.fov!.update(player, bounds, delta);
  }
}
