class scene2 extends Phaser.Scene {
  constructor() {
    super('scene2');
  }
  preload() {
    this.load.image('player1', 'images/player1.png');
    this.load.image('ball', 'images/face.png');
  }
  create() {
    /* GRID */

    // const agrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    // agrid.showNumbers();

    /* EVENT LISTENERS */
    this.input.keyboard.on('keydown_W', this.movePlayerOneUp, this);
    this.input.keyboard.on('keydown_S', this.movePlayerOneDown, this);

    this.input.keyboard.on('keydown_UP', this.movePlayerTwoUp, this);
    this.input.keyboard.on('keydown_DOWN', this.movePlayerTwoDown, this);

    /* TEXT HEADING */
    this.text1 = this.add.text(game.config.width / 2, 50, 'pong');
    this.text1.setOrigin(0.5, 0.5);

    /* SET UP PLAYERS */

    this.player1 = this.physics.add.sprite(
      100,
      game.config.height / 2,
      'player1'
    );
    this.player1.displayWidth = 100;
    this.player1.scaleY = this.player1.scaleX;
    this.player1.setImmovable();
    this.player1.body.collideWorldBounds = true;

    this.player2 = this.physics.add.sprite(
      980,
      game.config.height / 2,
      'player1'
    );
    this.player2.displayWidth = 100;
    this.player2.scaleY = this.player2.scaleX;
    this.player2.setImmovable();
    this.player2.body.collideWorldBounds = true;

    /* BALL */
    this.createBall(game.config.width / 2, game.config.height / 2);
  }
  movePlayerOneUp() {
    this.player1.y -= 50;
  }
  movePlayerOneDown() {
    this.player1.y += 50;
  }
  movePlayerTwoUp() {
    this.player2.y -= 50;
  }
  movePlayerTwoDown() {
    this.player2.y += 50;
  }
  createBall(x, y) {
    const ball = this.physics.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      'ball'
    );
    ball.body.collideWorldBounds = true;
    this.physics.add.collider(this.player1, ball);
    this.physics.add.collider(this.player2, ball);

    ball.setVelocity(600, 0);
    ball.setBounce(1, 0);
    ball.setGravityX(200); // green line shows where the gravity's going
  }

  update() {
    // if (this.ball.body.blocked.left) {
    //   console.log('player 2 scores');
    // }
    // const p1Keys = this.input.keyboard.createCursorKeys();
    // const p2Keys = this.input.keyboard.createCursorKeys();
    // if (p2Keys.down.isDown) {
    //   this.player2.y += 10;
    // } else if (p2Keys.up.isDown) {
    //   this.player2.y -= 10;
    // }
  }
}
