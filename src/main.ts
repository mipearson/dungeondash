import Phaser from "phaser";
import ReferenceScene from "./scenes/ReferenceScene";
import DungeonScene from "./scenes/DungeonScene";
import InfoScene from "./scenes/InfoScene";

import Tiles from "./tiles";
import RogueDungeon from "../assets/RogueDungeon.png";
import RoguePlayer from "../assets/RoguePlayer.png";
import DungeonFactory from "dungeon-factory";
import Mrpas from "mrpas";

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  // TODO: OnResize
  width: window.innerWidth,
  height: window.innerHeight,
  render: { pixelArt: true },
  physics: { default: "arcade", arcade: { debug: false, gravity: { y: 0 } } },
  scene: [DungeonScene, InfoScene]
  // scene: [ReferenceScene]
});

console.log(document.body.offsetWidth);
console.log(document.body.offsetHeight);
function setUpHotReload() {
  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
    module.hot.accept(() => {});
    // @ts-ignore
    module.hot.dispose(() => {
      window.location.reload();
    });
  }
}

setUpHotReload();
