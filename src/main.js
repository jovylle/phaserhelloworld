import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#808080',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload () {
  // Load assets here
  this.load.image('sky', 'assets/sky.png');
  this.load.image('star', 'assets/star.png');
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create () {
  // Add a background image
  this.add.image(400, 300, 'sky');

  // Add a group of stars
  const stars = this.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate((star) => {
    star.setScale(0.5);
    star.setAlpha(0.7);
  });

  // Add a sprite with animations
  const dude = this.add.sprite(400, 500, 'dude');

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  dude.anims.play('turn');

  // Input handling
  this.input.keyboard.on('keydown-LEFT', () => {
    dude.setVelocityX(-160);
    dude.anims.play('left', true);
  });

  this.input.keyboard.on('keydown-RIGHT', () => {
    dude.setVelocityX(160);
    dude.anims.play('right', true);
  });

  this.input.keyboard.on('keyup-LEFT', () => {
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown) {
      dude.setVelocityX(160);
      dude.anims.play('right', true);
    } else {
      dude.setVelocityX(0);
      dude.anims.play('turn');
    }
  });

  this.input.keyboard.on('keyup-RIGHT', () => {
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown) {
      dude.setVelocityX(-160);
      dude.anims.play('left', true);
    } else {
      dude.setVelocityX(0);
      dude.anims.play('turn');
    }
  });
}

function update () {
  // Update logic here
}
