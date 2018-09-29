import Phaser from "phaser";

export default class InfoScene extends Phaser.Scene {
  constructor() {
    super({ key: "InfoScene", active: true });
  }

  create(): void {
    const content = [
      "Phaser 3 tilemap & FOV experiment.",
      "",
      "Use arrow keys to walk around the map!",
      "Press space while moving to dash-attack!"
    ];
    const text = this.add.text(25, 25, content, {
      fontFamily: "sans-serif",
      color: "#ffffff"
    });
    text.setAlpha(0.9);
  }
}
