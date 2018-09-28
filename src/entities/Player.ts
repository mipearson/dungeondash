import Phaser from "phaser";
import Graphics from "../assets/Graphics";

const speed = 150;

export default class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private keys: Phaser.Input.Keyboard.CursorKeys;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    scene.anims.create({
      key: "player-walk",
      frames: scene.anims.generateFrameNumbers("player", {
        frames: Graphics.player.indices.south
      }),
      frameRate: 8,
      repeat: -1
    });

    this.sprite = scene.physics.add.sprite(x, y, "player", 0);
    this.sprite.setSize(13, 12);
    this.sprite.setOffset(9, 16);

    this.keys = scene.input.keyboard.createCursorKeys();
  }

  update() {
    const keys = this.keys;
    const body = <Phaser.Physics.Arcade.Body>this.sprite.body;

    // Stop any previous movement from the last frame
    body.setVelocity(0);

    // Horizontal movement
    if (keys.left!.isDown) {
      body.setVelocityX(-speed);
    } else if (keys.right!.isDown) {
      body.setVelocityX(speed);
    }

    // Vertical movement
    if (keys.up!.isDown) {
      body.setVelocityY(-speed);
    } else if (keys.down!.isDown) {
      body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    body.velocity.normalize().scale(speed);
  }
}
