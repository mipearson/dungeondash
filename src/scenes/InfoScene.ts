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
      "",
      "Dungeon generation via npmjs.com/package/dungeon-factory",
      "FOV calculation via npmjs.com/package/mrpas",
      "Tileset https://www.oryxdesignlab.com/products/tiny-dungeon-tileset"
    ];
    const text = this.add.text(25, 25, content, {
      fontFamily: "sans-serif",
      color: "#ffffff"
    });
    text.setAlpha(0.9);
  }
}
