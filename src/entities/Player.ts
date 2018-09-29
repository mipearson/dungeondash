import Phaser from "phaser";
import Graphics from "../assets/Graphics";

const speed = 150;
const attackSpeed = speed * 3;
const attackDuration = 150;

export default class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private keys: Phaser.Input.Keyboard.CursorKeys;

  private attackUntil: number;
  private attackLockedUntil: number;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    for (let animName in Graphics.player.frames) {
      scene.anims.create({
        key: `player-${animName}`,
        frames: scene.anims.generateFrameNumbers(
          "player",
          Graphics.player.frames[animName]
        ),
        frameRate: Graphics.player.frames[animName].frameRate,
        repeat: Graphics.player.frames[animName].repeat ? -1 : 0
      });
    }

    this.sprite = scene.physics.add.sprite(x, y, "player", 0);
    this.sprite.setSize(8, 8);
    this.sprite.setOffset(12, 20);
    this.sprite.anims.play("player-idle");

    this.keys = scene.input.keyboard.createCursorKeys();

    this.attackUntil = 0;
    this.attackLockedUntil = 0;
  }

  update(time: number) {
    const keys = this.keys;
    const body = <Phaser.Physics.Arcade.Body>this.sprite.body;
    let attackAnim = "";
    let moveAnim = "";

    if (time < this.attackUntil) {
      return;
    }
    // Stop any previous movement from the last frame
    body.setVelocity(0);

    // Horizontal movement
    if (keys.left!.isDown) {
      body.setVelocityX(-speed);
      this.sprite.setFlipX(true);
    } else if (keys.right!.isDown) {
      body.setVelocityX(speed);
      this.sprite.setFlipX(false);
    }

    // Vertical movement
    if (keys.up!.isDown) {
      body.setVelocityY(-speed);
    } else if (keys.down!.isDown) {
      body.setVelocityY(speed);
    }

    if (keys.left!.isDown || keys.right!.isDown) {
      moveAnim = "player-walk";
      attackAnim = "player-slash";
    } else if (keys.down!.isDown) {
      moveAnim = "player-walk";
      attackAnim = "player-slashDown";
    } else if (keys.up!.isDown) {
      moveAnim = "player-walkBack";
      attackAnim = "player-slashUp";
    } else {
      moveAnim = "player-idle";
    }

    if (keys.space!.isDown && time > this.attackLockedUntil) {
      this.attackUntil = time + attackDuration;
      this.attackLockedUntil = time + attackDuration * 2;
      body.velocity.normalize().scale(attackSpeed);
      this.sprite.anims.play(attackAnim, true);
      // this.sprite.setAlpha(0.7);
      this.sprite.setTint(0xffff88);
    } else {
      this.sprite.clearTint();
      // this.sprite.setAlpha(1);
      this.sprite.anims.play(moveAnim, true);
      body.velocity
        .normalize()
        .scale(time > this.attackLockedUntil ? speed : speed / 2);
    }
  }
}
