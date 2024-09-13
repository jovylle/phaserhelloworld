import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload () {
  // Load assets here
}

function create () {
  this.add.text(400, 300, 'Hello World!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5, 0.5);
}

function update () {
  // Update logic here
}
