import Phaser from "phaser";
import Fonts from "../assets/Fonts";

export default class InfoScene extends Phaser.Scene {
  constructor() {
    super({ key: "InfoScene" });
  }

  preload(): void {
    this.load.bitmapFont("default", ...Fonts.default);
  }

  create(): void {
    const content = [
      "Dungeon Dash!",
      "",
      "Use arrow keys to walk around the map!",
      "Press space while moving to dash-attack!",
      "",
      "Credits & more information at",
      "https://github.com/mipearson/dungeondash"
    ];
    const text = this.add.bitmapText(25, 25, "default", content, 20);
    text.setAlpha(0.7);
  }
}
