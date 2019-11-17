import RogueEnvironment from "../../assets/fongoose/RogueEnvironment.png";
import RoguePlayer from "../../assets/fongoose/RoguePlayer.png";
import RogueSlime from "../../assets/fongoose/RogueSlime.png";
import RogueItems from "../../assets/fongoose/RogueItems.png";

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
};

type AnimSet = GraphicSet & {
  animations: { [k: string]: AnimConfig };
};

const environment = {
  name: "environment",
  width: 16,
  height: 16,
  file: RogueEnvironment,
  indices: {
    floor: {
      outer: [0x05, 0x05, 0x05, 0x15, 0x07, 0x17],
      outerCorridor: [0x0d, 0x0d, 0x0d, 0x1d, 0x0f, 0x1f]
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

const player: AnimSet = {
  name: "player",
  width: 32,
  height: 32,
  file: RoguePlayer,
  animations: {
    idle: {
      key: "playerIdle",
      frames: { start: 0x01, end: 0x07 },
      frameRate: 6,
      repeat: -1
    },
    walk: {
      key: "playerWalk",
      frames: { start: 0x08, end: 0x0d },
      frameRate: 10,
      repeat: -1
    },
    walkBack: {
      key: "playerWalkBack",
      frames: { start: 0x10, end: 0x15 },
      frameRate: 10,
      repeat: -1
    },
    // Ideally attacks should be five frames at 30fps to
    // align with the attack duration of 165ms
    slash: {
      key: "playerSlash",
      frames: { frames: [0x18, 0x19, 0x19, 0x1a, 0x1b] },
      frameRate: 30
    },
    slashUp: {
      key: "playerSlashUp",
      frames: { frames: [0x21, 0x22, 0x22, 0x23, 0x24] },
      frameRate: 30
    },
    slashDown: {
      key: "playerSlashDown",
      frames: { frames: [0x29, 0x2a, 0x2a, 0x2b, 0x2c] },
      frameRate: 30
    },
    stagger: {
      key: "playerStagger",
      frames: { frames: [0x30, 0x31, 0x32, 0x32, 0x33, 0x34] },
      frameRate: 30
    },
    death: {
      key: "playerDeath",
      frames: { start: 0x38, end: 0x3d },
      frameRate: 24
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
      frames: { start: 0x00, end: 0x03 },
      frameRate: 4,
      repeat: -1
    },
    move: {
      key: "slimeMove",
      frames: { start: 0x10, end: 0x16 },
      frameRate: 6
    },
    death: {
      key: "slimeDeath",
      frames: {
        frames: [0x1f, 0x1e, 0x1d, 0x1c, 0x1b, 0x1a, 0x19, 0x18, 0x17]
      },
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
