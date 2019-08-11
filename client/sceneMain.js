/* eslist-disable no-undef */

class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
    this.state = {
      score: {
        player1: 0,
        player2: 0,
      },
      playerOneState: {
        direction: null,
        x: 100,
        y: 360,
      },
      playerTwoState: {
        direction: null,
      },
      playerCount: 0,
      playerId: null,
      ball: {
        x: 0,
        y: 0,
      },
    };
  }
  preload() {
    this.disableVisibilityChange = true;
    this.load.image('player1', 'images/player1.png');
    this.load.image('ball', 'images/face.png');
    this.load.audio('pop', ['sounds/pop.wav']);
    this.load.audio('arcade-music', ['sounds/arcade-music.wav']);

    socket.on('state', state => {
      this.state = state;
    });
  }

  // eslint-disable-next-line max-statements
  create() {
    const music = this.sound.add('arcade-music');
    const musicConfig = {
      mute: false,
      volume: 0.3,
      rate: 1.05,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    music.play(musicConfig);
    if (this.state.playerCount === 1) {
      this.isFirstPlayer = true;
    }
    this.input.keyboard.on('keydown_UP', () => this.setPlayerMoveState('up'));
    this.input.keyboard.on('keyup_UP', () => this.setPlayerMoveState(null));
    this.input.keyboard.on('keydown_DOWN', () =>
      this.setPlayerMoveState('down')
    );
    this.input.keyboard.on('keyup_DOWN', () => this.setPlayerMoveState(null));
    /* GRID */
    // const agrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    // agrid.showNumbers();

    /* TEXT HEADING */
    this.text1 = this.add.text(game.config.width / 2, 50, 'emojipong', {
      font: '30px',
    });
    this.text1.setOrigin(0.5, 0.5);
    if (this.state.playerCount === 1) {
      this.waitingForSecondPlayer = this.add.text(
        game.config.width / 2,
        game.config.height - 100,
        'practice mode: scoring will start when second player joins...',
        {
          font: '18px',
        }
      );
      this.waitingForSecondPlayer.setOrigin(0.5, 0.5);
    }

    /* SCORE */

    this.score1 = this.add.text(
      50,
      50,
      `p1 score: ${this.state.score.player1}`,
      {
        font: '20px',
      }
    );
    this.score2 = this.add.text(
      game.config.width - 190,
      50,
      `p2 score: ${this.state.score.player2}`,
      {
        font: '20px',
      }
    );

    /* SET UP PLAYERS */
    if (this.isFirstPlayer) {
      this.player1 = this.physics.add.sprite(
        100,
        game.config.height / 2,
        'player1'
      );
    } else {
      //get x and y from server
      console.log('this is player 2');
      this.player1 = this.physics.add.sprite(
        100,
        this.state.playerOneState.y,
        'player1'
      );
    }
    console.log(this.player1);
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
    socket.emit('playerTwoConnected', this.player2.x, this.player2.y);

    /* BALL */
    if (this.state.playerCount === 1) {
      this.createBall(game.config.width / 2, game.config.height / 2);
    } else {
      //receive ball (player2)
      this.getBall();
    }
  }

  setPlayerMoveState(dir) {
    socket.emit('dir', dir, this.isFirstPlayer);
  }

  getBall() {
    //player 2
    //receives ball state from server and creates a new ball with those
    ball = this.physics.add.sprite(
      this.state.ball.x,
      this.state.ball.y,
      'ball'
    );
    ball.body.collideWorldBounds = true;
    ball.setVelocity(1000, 100);
    ball.setBounce(1, 0);
    ball.body.setBounce(1, 1);
    ball.setGravityX(500);
    this.physics.add.collider(this.player1, ball, () =>
      this.game.sound.play('pop')
    );
    this.physics.add.collider(this.player2, ball, () =>
      this.game.sound.play('pop')
    );
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

    ball.setVelocity(1000, 100);
    ball.setBounce(1, 0);
    ball.body.setBounce(1, 1);
    ball.setGravityX(500); // green line on dev mode shows where the gravity's going
  }

  // eslint-disable-next-line complexity
  update() {
    this.score1.setText(`p1 score: ${this.state.score.player1}`);
    this.score2.setText(`p2 score: ${this.state.score.player2}`);
    if (this.isFirstPlayer && this.state.playerCount > 1) {
      this.waitingForSecondPlayer.setText('');
    }

    if (this.state.playerOneState.direction === 'up') {
      this.player1.y -= 10;
    } else if (this.state.playerOneState.direction === 'down') {
      this.player1.y += 10;
    }
    if (this.state.playerTwoState.direction === 'up') {
      this.player2.y -= 10;
    } else if (this.state.playerTwoState.direction === 'down') {
      this.player2.y += 10;
    }

    if (this.isFirstPlayer) {
      socket.emit('ballMoved', ball.x, ball.y);
      socket.emit('p1moved', this.player1.x, this.player1.y);
    } else {
      ball.x = this.state.ball.x;
      ball.y = this.state.ball.y;
    }

    if (this.isFirstPlayer && this.state.playerCount > 1) {
      if (ball.body.blocked.right) {
        socket.emit('p1scored');
      }
    } else {
      // is player 2
      // eslint-disable-next-line no-lonely-if
      if (ball.body.blocked.left && this.state.playerCount > 1) {
        socket.emit('p2scored');
      }
    }
  }
}
