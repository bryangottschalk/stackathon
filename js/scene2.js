class scene2 extends Phaser.Scene {
  constructor() {
    super('scene2');
  }
  preload() {
    this.load.image('player1', 'images/player1.png');
    this.load.image('ball', 'images/face.png');
    this.load.audio('pop', ['sounds/pop.wav']);
  }
  create() {
    /* GRID */

    // const agrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    // agrid.showNumbers();

    /* EVENT LISTENERS */
    this.input.keyboard.on('keydown_W', this.movePlayerOneUp);
    this.input.keyboard.on('keyup_W', this.stopMovingPlayerOne);

    this.input.keyboard.on('keydown_S', this.movePlayerOneDown);
    this.input.keyboard.on('keyup_S', this.stopMovingPlayerOne);

    this.input.keyboard.on('keydown_UP', this.movePlayerTwoUp);
    this.input.keyboard.on('keyup_UP', this.stopMovingPlayerTwo);

    this.input.keyboard.on('keydown_DOWN', this.movePlayerTwoDown);
    this.input.keyboard.on('keyup_DOWN', this.stopMovingPlayerTwo);

    /* TEXT HEADING */
    this.text1 = this.add.text(game.config.width / 2, 50, 'pong', {
      font: '30px',
    });
    this.text1.setOrigin(0.5, 0.5);

    /* SCORE */

    this.score1 = this.add.text(60, 50, `score: ${score.player1}`, {
      font: '20px',
    });
    this.score2 = this.add.text(
      game.config.width - 160,
      50,
      `score: ${score.player2}`,
      {
        font: '20px',
      }
    );

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

  stopMovingPlayerOne() {
    playerOneState.direction = null;
  }
  stopMovingPlayerTwo() {
    playerTwoState.direction = null;
  }

  movePlayerOneUp() {
    playerOneState.direction = 'up';
  }
  movePlayerOneDown() {
    playerOneState.direction = 'down';
  }
  movePlayerTwoUp() {
    playerTwoState.direction = 'up';
  }
  movePlayerTwoDown() {
    playerTwoState.direction = 'down';
  }

  createBall(x, y) {
    ball = this.physics.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      'ball'
    );
    ball.body.collideWorldBounds = true;

    this.physics.add.collider(this.player1, ball, () =>
      this.game.sound.play('pop')
    );
    this.physics.add.collider(this.player2, ball, () =>
      this.game.sound.play('pop')
    );

    ball.setVelocity(3000, 100);
    ball.setBounce(1, 0);
    ball.body.setBounce(1, 1);
    ball.setGravityX(200); // green line shows where the gravity's going
    return ball;
  }

  update() {
    if (playerOneState.direction === 'up') {
      this.player1.y -= 10;
    } else if (playerOneState.direction === 'down') {
      this.player1.y += 10;
    } else if (playerTwoState.direction === 'up') {
      this.player2.y -= 10;
    } else if (playerTwoState.direction === 'down') {
      this.player2.y += 10;
    }
    if (ball.body.blocked.right) {
      this.score1.text = `score: ${(score.player1 += 1)}`;
    }
    if (ball.body.blocked.left) {
      this.score2.text = `score: ${(score.player2 += 1)}`;
    }
  }
}
