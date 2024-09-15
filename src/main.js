import Phaser from 'phaser';

// Import assets from src directory
import skyImage from './assets/sky.png';
import dudeSheet from './assets/dude.png';
import starImage from './assets/star.png';
import cloudImage from './assets/clouds.png';
import bgMusicFile from './assets/night-ambience-17064.mp3';

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
  this.load.image('sky', skyImage);
  this.load.image('star', starImage);
  this.load.image('cloud', cloudImage);
  this.load.spritesheet('dude', dudeSheet, { frameWidth: 32, frameHeight: 48 });
  this.load.audio('bgMusic', bgMusicFile);  // Load background music
}

function create () {
  // Create a tiled background
  this.skyBackground = this.add.tileSprite(0, 0, config.width, config.height, 'sky').setOrigin(0, 0);

  // Add player character
  this.dude = this.physics.add.sprite(400, 300, 'dude');
  this.dude.setCollideWorldBounds(true); // Prevent from going out of bounds

  // Create animations for the character
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // Add WASD and arrow keys for movement
  this.cursors = this.input.keyboard.createCursorKeys();
  this.wasdKeys = {
    left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    shift: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
  };

  // Create a group of stars (collectibles) with randomized positions
  this.stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: {
      x: Phaser.Math.Between(50, config.width - 50),
      y: Phaser.Math.Between(50, config.height - 50),
      stepX: 70
    }
  });

  this.stars.children.iterate(function (star) {
    star.setY(Phaser.Math.Between(50, config.height - 50)); // Randomize the Y position
  });

  // Add collision detection between player and stars
  this.physics.add.overlap(this.dude, this.stars, collectStar, null, this);

  // Score display
  this.score = 0;
  this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

  // Play background music
  this.bgMusic = this.sound.add('bgMusic');
  this.bgMusic.play({ loop: true, volume: 0.5 });

  // Create moving clouds (with randomized positions)
  this.clouds = this.physics.add.group({
    key: 'cloud',
    repeat: 5,
    setXY: {
      x: Phaser.Math.Between(100, config.width - 100),
      y: Phaser.Math.Between(50, config.height - 50),
      stepX: 150
    }
  });

  this.clouds.children.iterate(function (cloud) {
    cloud.setY(Phaser.Math.Between(50, config.height - 50)); // Randomize the Y position
    cloud.setVelocityX(Phaser.Math.Between(-20, 20)); // Randomize cloud movement
  });
}

function update () {
  const baseSpeed = 160;
  let speed = baseSpeed;
  const scrollSpeed = 2;

  // Speed boost with shift key
  if (this.wasdKeys.shift.isDown) {
    speed = 300;
  }

  // Movement logic
  let isMoving = false;

  if (this.cursors.left.isDown || this.wasdKeys.left.isDown) {
    this.dude.setVelocityX(-speed);
    this.skyBackground.tilePositionX -= scrollSpeed; // Opposite direction
    // this.dude.anims.play('left', true);
    isMoving = true;
  } else if (this.cursors.right.isDown || this.wasdKeys.right.isDown) {
    this.dude.setVelocityX(speed);
    this.skyBackground.tilePositionX += scrollSpeed;
    // this.dude.anims.play('right', true);
    isMoving = true;
  } else {
    this.dude.setVelocityX(0);
  }

  if (this.cursors.up.isDown || this.wasdKeys.up.isDown) {
    this.dude.setVelocityY(-speed);
    this.skyBackground.tilePositionY -= scrollSpeed;
    isMoving = true;
  } else if (this.cursors.down.isDown || this.wasdKeys.down.isDown) {
    this.dude.setVelocityY(speed);
    this.skyBackground.tilePositionY += scrollSpeed;
    isMoving = true;
  } else {
    this.dude.setVelocityY(0);
  }

  // Stop animation if not moving
  if (!isMoving) {
    this.dude.anims.stop();
    this.dude.setFrame(4); // Idle frame
  }

  // Move clouds
  this.clouds.children.iterate(function (cloud) {
    if (cloud.x < 0) {
      cloud.x = game.config.width; // Loop the clouds
    }
  });
}

// Collect star function
function collectStar (player, star) {
  star.disableBody(true, true); // Remove star when collected
  this.score += 10;
  this.scoreText.setText('Score: ' + this.score); // Update score display
}
