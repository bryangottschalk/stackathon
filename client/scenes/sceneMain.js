/* eslint-disable complexity */
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
      bumper1: {
        y: 0,
      },
      bumper2: {
        y: 0,
      },
    };
  }
  preload() {
    this.disableVisibilityChange = true;
    this.load.spritesheet('archer', '/images/archer.png', {
      frameWidth: 1000,
      frameHeight: 1000,
    });
    this.load.spritesheet(
      'archerAttack',
      '/images/archer-attack-spritesheet.png',
      {
        frameWidth: 1051,
        frameHeight: 1000,
      }
    );
    this.load.spritesheet('wizard', '/images/wizard.png', {
      frameWidth: 1000,
      frameHeight: 1000,
    });
    this.load.spritesheet('fighter', '/images/fighter.png', {
      frameWidth: 1000,
      frameHeight: 1000,
    });
    this.load.image('orb', 'images/orb.png');
    this.load.image('forest', 'images/forest-background.png');
    this.load.audio('pop', ['sounds/pop.wav']);
    this.load.audio('arcade-music', ['sounds/arcade-music.wav']);

    socket.on('state', state => {
      this.state = state;
    });
  }

  // eslint-disable-next-line max-statements
  async create() {
    socket.on('gameOverMessage', text => {
      const parent = document.getElementById('events');
      const el = document.createElement('li');
      el.innerHTML = text;
      parent.appendChild(el);
    });

    this.background = this.add.image(
      game.config.width / 2,
      game.config.height / 2,
      'forest'
    );
    this.background.displayWidth = 1400;
    this.background.scaleY = this.background.scaleX;
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
    this.text1 = this.add.text(game.config.width / 2, 50, 'Crystal Baller', {
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
        'archer'
      );
    } else {
      //get x and y from server
      this.player1 = this.physics.add.sprite(
        100,
        this.state.playerOneState.y,
        'archer'
      );
    }
    this.player1.displayWidth = 175;
    this.player1.displayHeight = 175;
    this.player1.setImmovable();
    this.player1.body.collideWorldBounds = true;

    this.player2 = this.physics.add.sprite(
      980,
      game.config.height / 2,
      'wizard'
    );
    this.player2.displayWidth = 150;
    this.player2.scaleY = this.player2.scaleX;
    this.player2.setImmovable();
    this.player2.body.collideWorldBounds = true;
    socket.emit('playerTwoConnected', this.player2.x, this.player2.y);

    /* CREATE BALL AND BUMPERS */
    if (this.state.playerCount === 1) {
      this.createBall(game.config.width / 2, game.config.height / 2);
      this.createBumpers();
    } else {
      //receive ball (player2)
      await this.getBall();
      await this.getBumpers();
    }

    /////////////////////////////////////////////////////////////////
    /* SET UP ATTACKS --> move to archer attack function later */
    // console.log(this.player1, 'player1');
    // this.archerAttack = this.add.sprite(
    //   this.player1.x,
    //   this.player1.y + 200,
    //   'archerAttack'
    // );
    // this.archerAttack.displayWidth = 175;
    // this.archerAttack.displayHeight = 175;
    // this.archerAttack.scaleY = this.archerAttack.scaleX;
    // this.anims.generateFrameNumbers('archerAttack');
    // this.anims.create({
    //   key: 'archerAttack',
    //   frames: [
    //     { key: 'archerAttack', frame: 0 },
    //     { key: 'archerAttack', frame: 1 },
    //     { key: 'archerAttack', frame: 2 },
    //     { key: 'archerAttack', frame: 3 },
    //     { key: 'archerAttack', frame: 4 },
    //   ],
    //   frameRate: 5,
    //   repeat: -1,
    // });
    // this.archerAttack.play('archerAttack');
    /////////////////////////////////////////////////////////////////
  }

  setPlayerMoveState(dir) {
    socket.emit('dir', dir, this.isFirstPlayer);
  }
  createBumpers() {
    this.speed = 100;
    this.bumper1 = this.physics.add.sprite(
      game.config.width / 2,
      (game.config.height * 2) / 3,
      'fighter'
    );
    this.bumper2 = this.physics.add.sprite(
      game.config.width / 2,
      game.config.height / 3,
      'fighter'
    );
    this.bumper1.displayWidth = 75;
    this.bumper1.scaleY = this.bumper1.scaleX;
    this.bumper2.displayWidth = 75;
    this.bumper2.scaleY = this.bumper2.scaleX;

    this.bumper1.setVelocityY(this.speed);
    this.bumper2.setVelocityY(-this.speed);
    this.bumper1.setImmovable();
    this.bumper2.setImmovable();
    this.physics.add.collider(this.bumper1, ball);
    this.physics.add.collider(this.bumper2, ball);
  }
  getBumpers() {
    this.bumper1 = this.physics.add.sprite(
      game.config.width / 2,
      this.state.bumper1.y,
      'fighter'
    );
    this.bumper2 = this.physics.add.sprite(
      game.config.width / 2,
      this.state.bumper2.y,
      'fighter'
    );
    this.bumper1.displayWidth = 75;
    this.bumper1.scaleY = this.bumper1.scaleX;
    this.bumper2.displayWidth = 75;
    this.bumper2.scaleY = this.bumper2.scaleX;

    // this.bumper1.setVelocityY(this.speed);
    // this.bumper2.setVelocityY(-this.speed);
    // this.bumper1.setImmovable();
    // this.bumper2.setImmovable();
    // this.physics.add.collider(this.bumper1, ball, () =>
    //   console.log('hit bumper 1')
    // );
    // this.physics.add.collider(this.bumper2, ball, () =>
    //   console.log('hit bumper 2')
    // );
  }

  getBall() {
    //player 2
    //receives ball state from server and creates a new ball with those x and y coordinates
    ball = this.physics.add.sprite(this.state.ball.x, this.state.ball.y, 'orb');
    // this.anims.create({
    //   key: 'dance',
    //   frames: [{ key: 'monster1', frame: 0 }, { key: 'monster2', frame: 0 }],
    //   frameRate: 8,
    //   repeat: -1,
    // });
    // ball.play('dance');
    ball.displayWidth = 150;
    ball.scaleY = ball.scaleX;
    ball.body.collideWorldBounds = true;
    ball.setVelocity(600, 600);
    ball.setBounce(1, 1);
    ball.body.setBounce(1, 1);
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
      'orb'
    );
    ball.displayWidth = 150;
    ball.scaleY = ball.scaleX;

    ball.body.collideWorldBounds = true;

    // this.anims.create({
    //   key: 'dance',
    //   frames: [{ key: 'monster1', frame: 0 }, { key: 'monster2', frame: 0 }],
    //   frameRate: 4,
    //   repeat: -1,
    // });
    // ball.play('dance');

    ball.setVelocity(600, 600);
    ball.setBounce(1, 1);
    ball.body.setBounce(1, 1);
    this.physics.add.collider(this.player1, ball, () =>
      this.game.sound.play('pop')
    );
    this.physics.add.collider(this.player2, ball, () =>
      this.game.sound.play('pop')
    );
  }
  archerAttack() {}

  // eslint-disable-next-line complexity
  // eslint-disable-next-line max-statements
  update() {
    console.log();
    this.score1.setText(`p1 score: ${this.state.score.player1}`);
    this.score2.setText(`p2 score: ${this.state.score.player2}`);
    if (this.isFirstPlayer && this.state.playerCount > 1) {
      this.waitingForSecondPlayer.setText('');
    }
    if (this.state.playerOneState.direction === 'up') {
      this.player1.y -= 20;
    } else if (this.state.playerOneState.direction === 'down') {
      this.player1.y += 20;
    }
    if (this.state.playerTwoState.direction === 'up') {
      this.player2.y -= 20;
    } else if (this.state.playerTwoState.direction === 'down') {
      this.player2.y += 20;
    }
    if (this.isFirstPlayer) {
      socket.emit('ballMoved', ball.x, ball.y);
      socket.emit('p1moved', this.player1.x, this.player1.y);
      socket.emit('bumpersMoved', this.bumper1.y, this.bumper2.y);
    } else {
      ball.x = this.state.ball.x;
      ball.y = this.state.ball.y;
      this.bumper1.y = this.state.bumper1.y;
      this.bumper2.y = this.state.bumper2.y;
    }
    if (ball.body.blocked.right && this.state.playerCount > 1) {
      socket.emit('p1scored');
      this.checkWin();
    }
    if (ball.body.blocked.left && this.state.playerCount > 1) {
      socket.emit('p2scored');
      this.checkWin();
    }
    if (this.isFirstPlayer && this.bumper1.y > this.game.config.height) {
      this.bumper1.setVelocityY(-this.speed);
    }
    if (this.isFirstPlayer && this.bumper1.y < 0) {
      this.bumper1.setVelocityY(this.speed);
    }
    if (this.isFirstPlayer && this.bumper2.y > this.game.config.height) {
      this.bumper2.setVelocityY(-this.speed);
    }
    if (this.isFirstPlayer && this.bumper2.y < 0) {
      this.bumper2.setVelocityY(this.speed);
    }
  }
  checkWin() {
    if (this.state.score.player1 >= 9) {
      this.scene.start('GameOver', 'player 1 wins');
      socket.emit('gameOver', 'player 1 wins');
    }
    if (this.state.score.player2 >= 9) {
      this.scene.start('GameOver');
      socket.emit('gameOver');
    }
  }
}
