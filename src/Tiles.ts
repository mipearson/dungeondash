import RogueDungeon from "../assets/RogueDungeon.png";
import RoguePlayer from "../assets/RoguePlayer.png";
import Util from "../assets/Util.png";

interface Tileset {
  width: number;
  height: number;
  file: string;
  indices: any;
}

export default class Tiles {
  static readonly dungeon: Tileset = {
    width: 16,
    height: 16,
    file: RogueDungeon,
    indices: {
      floor: {
        outer: [0x0, 0x08, 0x10]
      },
      block: 0x17
    }
  };

  static readonly player: Tileset = {
    width: 32,
    height: 32,
    file: RoguePlayer,
    indices: {
      south: [0x01, 0x02, 0x03, 0x04]
    }
  };

  static readonly util: Tileset = {
    width: 16,
    height: 16,
    file: Util,
    indices: {
      black: 0x00
    }
  };

  static randomIndex = (indices: Array<number>): number => {
    return indices[Math.floor(Math.random() * indices.length)];
  };
}
