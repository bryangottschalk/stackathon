class scene2 extends Phaser.Scene {
  constructor() {
    super('scene2');
  }
  preload() {
    this.load.image('player1', 'images/player1.png');
    this.load.image('face', 'images/face.png');
  }
  create() {
    this.text1 = this.add.text(game.config.width / 2, 50, 'pong');
    this.text1.setOrigin(0.5, 0.5);

    // this.player1 = this.add.image(100, game.config.height / 2, 'player1');
    // this.player1.displayWidth = 100;
    // this.player1.scaleY = this.player1.scaleX;

    // this.player2 = this.add.image(980, game.config.height / 2, 'player1');
    // this.player2.displayWidth = 100;
    // this.player2.scaleY = this.player2.scaleX;

    // this.graphics = this.add.graphics();
    // this.graphics.fillStyle(0xff00ff, 0.5); adds purple circle
    // this.graphics.fillCircle(game.config.width / 2, game.config.height / 2, 20); //x, y, radius

    this.player1 = this.physics.add.sprite(
      100,
      game.config.height / 2,
      'player1'
    );
    this.player1.displayWidth = 100;
    this.player1.scaleY = this.player1.scaleX;

    this.player2 = this.physics.add.sprite(
      980,
      game.config.height / 2,
      'player1'
    );
    this.player2.displayWidth = 100;
    this.player2.scaleY = this.player2.scaleX;

    this.ball = this.physics.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      'face'
    );
    this.ball.setBounce(1, 0);
    this.ball.setGravityX(200); // green line shows where the gravity's going
  }

  update() {}
}
