import Phaser from 'phaser';

// Import assets from src directory
import skyImage from './assets/sky.png';
import dudeSheet from './assets/dude.png';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#ffffff',
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
  // Create a tiled background and store it in the scene
  this.skyBackground = this.add.tileSprite(0, 0, config.width, config.height, 'sky').setOrigin(0, 0);

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
  const scrollSpeed = 2; // Adjust the background scroll speed

  // Get current movement input from cursors or WASD
  let isMoving = false;

  if (this.cursors.left.isDown || this.wasdKeys.left.isDown) {
    this.dude.setVelocityX(-speed); // Move left
    isMoving = true;
    this.skyBackground.tilePositionX -= scrollSpeed; // Scroll background to the right (opposite direction)
  } else if (this.cursors.right.isDown || this.wasdKeys.right.isDown) {
    this.dude.setVelocityX(speed); // Move right
    isMoving = true;
    this.skyBackground.tilePositionX += scrollSpeed; // Scroll background to the left (opposite direction)
  } else {
    this.dude.setVelocityX(0); // Stop horizontal movement
  }

  if (this.cursors.up.isDown || this.wasdKeys.up.isDown) {
    this.dude.setVelocityY(-speed); // Move up
    isMoving = true;
    this.skyBackground.tilePositionY -= scrollSpeed; // Scroll background downwards (opposite direction)
  } else if (this.cursors.down.isDown || this.wasdKeys.down.isDown) {
    this.dude.setVelocityY(speed); // Move down
    isMoving = true;
    this.skyBackground.tilePositionY += scrollSpeed; // Scroll background upwards (opposite direction)
  } else {
    this.dude.setVelocityY(0); // Stop vertical movement
  }

  // If not moving, stop any scrolling of the background
  if (!isMoving) {
    this.dude.setVelocityX(0);
    this.dude.setVelocityY(0);
  }
}
