class scene2 extends Phaser.Scene {
  constructor() {
    super('scene2');
  }
  preload() {
    this.load.image('player1', 'images/player1.png');
    this.load.image('face', 'images/face.png');
  }
  create() {
    // const agrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });
    // agrid.showNumbers();
    this.input.keyboard.on('keydown_W', this.movePlayerOneUp, this);
    this.input.keyboard.on('keydown_S', this.movePlayerOneDown, this);

    this.input.keyboard.on('keydown_UP', this.movePlayerTwoUp, this);
    this.input.keyboard.on('keydown_DOWN', this.movePlayerTwoDown, this);

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

    //change images to sprites
    this.player1 = this.physics.add.sprite(
      100,
      game.config.height / 2,
      'player1'
    );
    this.player1.displayWidth = 100;
    this.player1.scaleY = this.player1.scaleX;
    this.player1.setImmovable();

    this.player2 = this.physics.add.sprite(
      980,
      game.config.height / 2,
      'player1'
    );
    this.player2.displayWidth = 100;
    this.player2.scaleY = this.player2.scaleX;
    this.player2.setImmovable();

    this.ball = this.physics.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      'face'
    );
    console.log('player1', this.player1);
    this.physics.add.collider(this.player1, this.ball);
    this.physics.add.collider(this.player2, this.ball);

    this.ball.setVelocity(600, 0);
    this.ball.setBounce(1, 0);
    this.ball.setGravityX(200); // green line shows where the gravity's going
    const cursors = this.input.keyboard.createCursorKeys();
    console.log('TCL: scene2 -> create -> cursors ', cursors);
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
  update() {
    // const p1Keys = this.input.keyboard.createCursorKeys();
    // const p2Keys = this.input.keyboard.createCursorKeys();
    // if (p2Keys.down.isDown) {
    //   this.player2.y += 10;
    // } else if (p2Keys.up.isDown) {
    //   this.player2.y -= 10;
    // }
  }
}
