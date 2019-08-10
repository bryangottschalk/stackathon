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
      },
      playerTwoState: {
        direction: null,
      },
      // playerIds: [],
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
    // console.log('socket in phaser', socket);
    // console.log('io in phaser', io);

    this.input.keyboard.on('keydown_UP', () => this.setPlayerMoveState('up'));
    this.input.keyboard.on('keyup_UP', () => this.setPlayerMoveState(null));

    this.input.keyboard.on('keydown_DOWN', () =>
      this.setPlayerMoveState('down')
    );
    this.input.keyboard.on('keyup_DOWN', () => this.setPlayerMoveState(null));

    socket.on('state', state => {
      this.state = state;
    });
  }

  create() {
    console.log('STATE', this.state);

    /* GRID */

    // const agrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    // agrid.showNumbers();

    /* EVENT LISTENERS */

    /* TEXT HEADING */
    this.text1 = this.add.text(game.config.width / 2, 50, 'pong', {
      font: '30px',
    });
    this.text1.setOrigin(0.5, 0.5);

    /* SCORE */

    this.score1 = this.add.text(60, 50, `score: ${this.state.score.player1}`, {
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
    if (this.state.playerCount === 1) {
      this.createBall(game.config.width / 2, game.config.height / 2);
    }

    // this.move
  }

  setPlayerMoveState(dir) {
    console.log('TCL: setPlayerMoveState -> dir', dir);
    // this.state.playerOneState.direction = dir;
    socket.emit('dir', dir);
  }

  createBall(x, y) {
    console.log(this.state);
    console.log('in createBall');
    this.state.ball = this.physics.add.sprite(
      this.state.ball.x,
      this.state.ball.y,
      'ball'
    );
    // const ballTween = this.add.tween(ball);
    // console.log('TCL: createBall -> ballTween', ballTween);
    this.state.ball.body.collideWorldBounds = true;

    // this.physics.add.collider(this.player1, ball, () =>
    //   this.game.sound.play('pop')
    // );
    // this.physics.add.collider(this.player2, ball, () =>
    //   this.game.sound.play('pop')
    // );

    this.state.ball.setVelocity(1000, 100);
    this.state.ball.setBounce(1, 0);
    this.state.ball.body.setBounce(1, 1);
    this.state.ball.setGravityX(200); // green line shows where the gravity's going
    return this.state.ball;
  }

  moveBall(x, y) {
    const tween = this.add.tween(ball);
    // console.log('TCL: moveBall -> tween', tween);
  }

  update() {
    if (this.state.playerOneState.direction === 'up') {
      this.player1.y -= 10;
    } else if (this.state.playerOneState.direction === 'down') {
      this.player1.y += 10;
    }
    // ball.x = this.state.ball.x;
    // ball.y = this.state.ball.y;
    // console.log(this.state.ball.x);
    // console.log('y', this.state.ball.y);

    socket.emit('ballMoved', this.state.ball.x, this.state.ball.y);

    // if (this.state.ball.body.blocked.right) {
    //   socket.emit('scored');
    //   this.score1.setText(`score: ${this.state.score.player1}`);
    // }
    // if (this.state.ball.body.blocked.left) {
    //   this.score2.text = `score: ${(score.player2 += 1)}`;
    // }
  }
}
