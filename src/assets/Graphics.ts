import RogueEnvironment from "../../assets/fongoose/RogueEnvironment16x16-extruded.png";
import RoguePlayer from "../../assets/fongoose/RoguePlayer_48x48.png";
import RogueSlime from "../../assets/fongoose/RogueSlime32x32.png";
import RogueItems from "../../assets/fongoose/RogueItems16x16.png";

import Util from "../../assets/Util.png";

type AnimConfig = {
  key: string;
  frames: Phaser.Types.Animations.GenerateFrameNumbers;
  defaultTextureKey?: string;
  frameRate?: integer;
  duration?: integer;
  skipMissedFrames?: boolean;
  delay?: integer;
  repeat?: integer;
  repeatDelay?: integer;
  yoyo?: boolean;
  showOnStart?: boolean;
  hideOnComplete?: boolean;
};

type GraphicSet = {
  name: string;
  width: number;
  height: number;
  file: string;
  margin?: number;
  spacing?: number;
};

type AnimSet = GraphicSet & {
  animations: { [k: string]: AnimConfig };
};

const environment = {
  name: "environment",
  width: 16,
  height: 16,
  margin: 1,
  spacing: 2,
  file: RogueEnvironment,
  indices: {
    floor: {
      outer: [0x05, 0x05, 0x05, 0x15, 0x07, 0x17],
      outerCorridor: [0x0d, 0x0d, 0x0d, 0x1d, 0x0f, 0x1f]
    },
    block: 0x17,
    doors: {
      horizontal: 0x81,
      vertical: 0x92,
      destroyed: 0x35
    },
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
        n_w: 0x33,
        e_door: 0x65,
        w_door: 0x67
      }
    }
  }
};

const player: AnimSet = {
  name: "player",
  width: 48,
  height: 48,
  file: RoguePlayer,
  animations: {
    idle: {
      key: "playerIdle",
      frames: { start: 0x01, end: 0x07 },
      frameRate: 6,
      repeat: -1
    },
    idleBack: {
      key: "playerIdleBack",
      frames: { start: 0x0a, end: 0x11 },
      frameRate: 6,
      repeat: -1
    },
    walk: {
      key: "playerWalk",
      frames: { start: 0x14, end: 0x19 },
      frameRate: 10,
      repeat: -1
    },
    walkBack: {
      key: "playerWalkBack",
      frames: { start: 0x1e, end: 0x23 },
      frameRate: 10,
      repeat: -1
    },
    // Ideally attacks should be five frames at 30fps to
    // align with the attack duration of 165ms
    slash: {
      key: "playerSlash",
      frames: { frames: [0x1a, 0x1a, 0x1a, 0x1b, 0x1c] },
      frameRate: 30
    },
    slashUp: {
      key: "playerSlashUp",
      frames: { frames: [0x2e, 0x2e, 0x2e, 0x2f, 0x30] },
      frameRate: 30
    },
    slashDown: {
      key: "playerSlashDown",
      frames: { frames: [0x24, 0x24, 0x24, 0x25, 0x26] },
      frameRate: 30
    },
    stagger: {
      key: "playerStagger",
      frames: { frames: [0x38, 0x38, 0x39, 0x3a] },
      frameRate: 30
    }
  }
};

const slime: AnimSet = {
  name: "slime",
  width: 32,
  height: 32,
  file: RogueSlime,
  animations: {
    idle: {
      key: "slimeIdle",
      frames: { start: 0x00, end: 0x05 },
      frameRate: 6,
      repeat: -1
    },
    move: {
      key: "slimeMove",
      frames: { start: 0x08, end: 0x0e },
      frameRate: 8,
      repeat: -1
    },
    death: {
      key: "slimeDeath",
      frames: { start: 0x20, end: 0x26 },
      frameRate: 16,
      hideOnComplete: true
    }
  }
};

const items = {
  name: "items",
  width: 16,
  height: 16,
  file: RogueItems
};

const util = {
  name: "util",
  width: 16,
  height: 16,
  file: Util,
  indices: {
    black: 0x00
  }
};

export default {
  environment,
  player,
  slime,
  items,
  util
};
