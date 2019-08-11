class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }
  preload() {
    this.load.image('playAgain', '/images/btnPlayAgain.png');
    console.log('io', io);
  }
  create() {
    this.btnPlayAgain = this.add.image(
      game.config.width / 2,
      game.config.height / 2,
      'playAgain'
    );
    this.btnPlayAgain.setInteractive();
    this.btnPlayAgain.on('pointerdown', this.playAgain, this);
    console.log('socket', socket);
    console.log('GAME OVER');
  }
  playAgain() {
    this.scene.start('SceneMain');
  }
  update() {}
}
