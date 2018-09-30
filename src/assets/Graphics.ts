import RogueDungeon from "../../assets/RogueDungeon.png";
import RoguePlayer from "../../assets/RoguePlayer.png";
import Util from "../../assets/Util.png";

interface Frames {
  [name: string]: {
    start?: number;
    end?: number;
    frames?: Array<number>;
    repeat?: boolean;
    frameRate: number;
  };
}

export default class Graphics {
  static readonly dungeon = {
    name: "dungeon",
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
    name: "player",
    width: 32,
    height: 32,
    file: RoguePlayer,
    frames: {
      idle: { start: 0x01, end: 0x07, frameRate: 6 },
      walk: { start: 0x08, end: 0x0d, frameRate: 10 },
      walkBack: { start: 0x10, end: 0x15, frameRate: 10 },
      // Ideally attacks should be five frames at 30fps to
      // align with the attack duration of 165ms
      slash: {
        frames: [0x18, 0x19, 0x19, 0x1a, 0x1b],
        frameRate: 30,
        repeat: false
      },
      slashUp: {
        frames: [0x21, 0x22, 0x22, 0x23, 0x24],
        frameRate: 30,
        repeat: false
      },
      slashDown: {
        frames: [0x29, 0x2a, 0x2a, 0x2b, 0x2c],
        frameRate: 30,
        repeat: false
      },
      hit: { start: 0x30, end: 0x34, frameRate: 24, repeat: false },
      death: { start: 0x38, end: 0x3d, frameRate: 24, repeat: false }
    } as Frames
  };

  static readonly util = {
    name: "util",
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
