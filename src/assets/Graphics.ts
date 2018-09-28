import RogueDungeon from "../../assets/RogueDungeon.png";
import RoguePlayer from "../../assets/RoguePlayer.png";
import Util from "../../assets/Util.png";

interface Tileset {
  width: number;
  height: number;
  file: string;
  indices: any;
}

export default class Graphics {
  static readonly dungeon = {
    width: 16,
    height: 16,
    file: RogueDungeon,
    indices: {
      floor: {
        outer: [0x0, 0x08, 0x10]
      },
      block: 0x17,
      walls: {
        enclosed: 0x21,
        alone: 0x34,
        edges: {
          outer: {
            nw: 0x18,
            n: 0x19,
            ne: 0x1a,
            w: 0x20,
            e: 0x22,
            sw: 0x28,
            s: 0x29,
            se: 0x2a
          },
          inner: {
            se: 0x1b,
            sw: 0x1c,
            ne: 0x23,
            nw: 0x24
          }
        },
        intersections: {
          e_s: 0x30,
          n_e_s_w: 0x31,
          e_w: 0x32,
          s_w: 0x33,
          n_e_s: 0x38,
          w: 0x39,
          e: 0x3a,
          n_s_w: 0x3b,
          n_s: 0x40,
          s: 0x41,
          e_s_w: 0x42,
          n_e: 0x48,
          n_e_w: 0x49,
          n: 0x4a,
          n_w: 0x4b
        }
      }
    }
  };

  static readonly player = {
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
