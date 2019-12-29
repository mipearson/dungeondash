import Phaser from "phaser";
import Fonts from "../assets/Fonts";

export default class InfoScene extends Phaser.Scene {
  text?: Phaser.GameObjects.DynamicBitmapText;
  lastUpdate?: number;

  constructor() {
    super({ key: "InfoScene" });
  }

  preload(): void {
    this.load.bitmapFont("default", ...Fonts.default);
  }

  create(): void {
    this.text = this.add.dynamicBitmapText(25, 25, "default", "", 12);
    this.text.setAlpha(0.7);
    this.lastUpdate = 0;
  }

  update(time: number, _: number): void {
    if (time > this.lastUpdate! + 100) {
      this.text!.setText([
        "Dungeon Dash!",
        "",
        "Use arrow keys to walk around the map!",
        "Press space while moving to dash-attack!",
        "(debug: Q, tilesets: R)",
        "",
        "Credits & more information at",
        "https://github.com/mipearson/dungeondash",
        "",
        "FPS: " + Math.round(this.game.loop.actualFps)
      ]);
      this.lastUpdate = time;
    }
  }
}
