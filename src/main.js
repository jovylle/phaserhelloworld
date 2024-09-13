import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,  // Full width
  height: window.innerHeight, // Full height
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

let dude;
let cursors;
let background;

function preload () {
  // Load assets here
  this.load.image('sky', 'assets/sky.png'); // Path to your background image
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create () {
  // Add a large, tiled background
  background = this.add.tileSprite(0, 0, config.width, config.height, 'sky');
  background.setOrigin(0, 0); // Set the origin to the top-left corner

  // Add a physics sprite
  dude = this.physics.add.sprite(400, 300, 'dude');
  dude.setCollideWorldBounds(true); // Prevent the sprite from going out of bounds

  // Set up keyboard controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update () {
  // Movement speed
  const speed = 160;

  // Check for cursor input and move the character
  if (cursors.left.isDown) {
    dude.setVelocityX(-speed); // Move left
  } else if (cursors.right.isDown) {
    dude.setVelocityX(speed); // Move right
  } else {
    dude.setVelocityX(0); // Stop horizontal movement
  }

  if (cursors.up.isDown) {
    dude.setVelocityY(-speed); // Move up
  } else if (cursors.down.isDown) {
    dude.setVelocityY(speed); // Move down
  } else {
    dude.setVelocityY(0); // Stop vertical movement
  }
}
