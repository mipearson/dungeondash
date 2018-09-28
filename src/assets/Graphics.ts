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
  static readonly dungeon: Tileset = {
    width: 16,
    height: 16,
    file: RogueDungeon,
    indices: {
      floor: {
        outer: [0x0, 0x08, 0x10]
      },
      block: 0x17,
      walls: {
        // keyed based on neighbours present, from north clockwise
        e_se_s: 0x18,
        e_se_s_sw_w: 0x19,
        s_sw_w: 0x1a,
        n_ne_e_s_sw_w_nw: 0x1b,
        n_ne_e_se_s_w_nw: 0x1c,
        n_ne_e_se_s: 0x20,
        n_ne_e_se_s_sw_w_nw: 0x21,
        n_s_sw_w_nw: 0x22,
        n_e_se_s_sw_w_nw: 0x23,
        n_ne_e_se_s_sw_w: 0x24,
        n_ne_e: 0x28,
        n_ne_e_w_nw: 0x29,
        n_w_nw: 0x2a,
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
        n_w: 0x4b,
        nil: 0x34
      } as { [dir: string]: number }
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
