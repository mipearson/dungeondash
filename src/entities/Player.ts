import Phaser from "phaser";
import Graphics from "../assets/Graphics";

const speed = 125;
const attackSpeed = 500;
const attackDuration = 165;
const attackCooldown = attackDuration * 2;

export default class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private keys: Phaser.Input.Keyboard.CursorKeys;

  private attackUntil: number;
  private attackLockedUntil: number;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private body: Phaser.Physics.Arcade.Body;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    for (let animName in Graphics.player.frames) {
      if (scene.anims.get(`player-${animName}`)) {
        continue;
      }
      scene.anims.create({
        key: `player-${animName}`,
        frames: scene.anims.generateFrameNumbers(
          Graphics.player.name,
          Graphics.player.frames[animName]
        ),
        frameRate: Graphics.player.frames[animName].frameRate,
        repeat: Graphics.player.frames[animName].repeat ? -1 : 0
      });
    }

    this.sprite = scene.physics.add.sprite(x, y, Graphics.player.name, 0);
    this.sprite.setSize(8, 8);
    this.sprite.setOffset(12, 20);
    this.sprite.anims.play("player-idle");

    this.keys = scene.input.keyboard.createCursorKeys();

    this.attackUntil = 0;
    this.attackLockedUntil = 0;
    const particles = scene.add.particles(Graphics.player.name);
    this.emitter = particles.createEmitter({
      alpha: { start: 0.7, end: 0, ease: "Cubic.easeOut" },
      follow: this.sprite,
      quantity: 1,
      lifespan: 200,
      blendMode: Phaser.BlendModes.ADD,
      scaleX: () => (this.sprite.flipX ? -1 : 1),
      emitCallback: (particle: Phaser.GameObjects.Particles.Particle) => {
        particle.frame = this.sprite.frame;
      }
    });
    this.emitter.stop();

    this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
  }

  update(time: number) {
    const keys = this.keys;
    let attackAnim = "";
    let moveAnim = "";

    if (time < this.attackUntil) {
      return;
    }
    // Stop any previous movement from the last frame
    this.body.setVelocity(0);

    // Horizontal movement
    if (keys.left!.isDown) {
      this.body.setVelocityX(-speed);
      this.sprite.setFlipX(true);
    } else if (keys.right!.isDown) {
      this.body.setVelocityX(speed);
      this.sprite.setFlipX(false);
    }

    // Vertical movement
    if (keys.up!.isDown) {
      this.body.setVelocityY(-speed);
    } else if (keys.down!.isDown) {
      this.body.setVelocityY(speed);
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

    if (
      keys.space!.isDown &&
      time > this.attackLockedUntil &&
      this.body.velocity.length() > 0
    ) {
      this.attackUntil = time + attackDuration;
      this.attackLockedUntil = time + attackDuration + attackCooldown;
      this.body.velocity.normalize().scale(attackSpeed);
      this.sprite.anims.play(attackAnim, true);
      this.emitter.start();
      this.sprite.setBlendMode(Phaser.BlendModes.ADD);
    } else {
      this.sprite.anims.play(moveAnim, true);
      this.body.velocity.normalize().scale(speed);
      this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
      if (this.emitter.on) {
        this.emitter.stop();
      }
    }
  }
}
