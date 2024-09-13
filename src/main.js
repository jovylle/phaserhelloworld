import Phaser from 'phaser';

// Import assets from src directory
import skyImage from './assets/sky.png';
import dudeSheet from './assets/dude.png';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#ffffff', // Solid white background
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
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
  // Load assets using imported paths
  this.load.image('sky', skyImage);
  this.load.spritesheet('dude', dudeSheet, {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create () {
  // Add a large, tiled background
  this.add.tileSprite(0, 0, config.width, config.height, 'sky').setOrigin(0, 0);

  // Add a physics sprite and store it in the scene
  this.dude = this.physics.add.sprite(400, 300, 'dude');
  this.dude.setCollideWorldBounds(true); // Prevent the sprite from going out of bounds

  // Set up keyboard controls and store in scene
  this.cursors = this.input.keyboard.createCursorKeys();

  // Add WASD controls
  this.wasdKeys = {
    left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
  };
}

function update () {
  const speed = 160;

  // Get current movement input from cursors or WASD
  let isMoving = false;

  if (this.cursors.left.isDown || this.wasdKeys.left.isDown) {
    this.dude.setVelocityX(-speed); // Move left
    isMoving = true;
  } else if (this.cursors.right.isDown || this.wasdKeys.right.isDown) {
    this.dude.setVelocityX(speed); // Move right
    isMoving = true;
  } else {
    this.dude.setVelocityX(0); // Stop horizontal movement
  }

  if (this.cursors.up.isDown || this.wasdKeys.up.isDown) {
    this.dude.setVelocityY(-speed); // Move up
    isMoving = true;
  } else if (this.cursors.down.isDown || this.wasdKeys.down.isDown) {
    this.dude.setVelocityY(speed); // Move down
    isMoving = true;
  } else {
    this.dude.setVelocityY(0); // Stop vertical movement
  }

  // If not moving, play the 'turn' animation
  if (!isMoving) {
    this.dude.setVelocityX(0);
    this.dude.setVelocityY(0);
  }
}
