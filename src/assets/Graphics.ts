import RogueEnvironment from "../../assets/fongoose/RogueEnvironment.png";
import RoguePlayer from "../../assets/fongoose/RoguePlayer.png";
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
  static readonly environment = {
    name: "environment",
    width: 16,
    height: 16,
    file: RogueEnvironment,
    indices: {
      floor: {
        outer: [0x05, 0x05, 0x05, 0x15, 0x07, 0x17]
      },
      block: 0x17,
      walls: {
        alone: 0x14,
        intersections: {
          e_s: 0x00,
          n_e_s_w: 0x01,
          e_w: 0x02,
          s_w: 0x03,
          n_e_s: 0x10,
          w: 0x11,
          e: 0x12,
          n_s_w: 0x13,
          n_s: 0x20,
          s: 0x21,
          e_s_w: 0x22,
          n_e: 0x30,
          n_e_w: 0x31,
          n: 0x32,
          n_w: 0x33
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
