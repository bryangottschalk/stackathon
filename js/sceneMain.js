//udemy course lesson 1-20
class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload() {
    //load our images or sounds
    this.load.image('player1', 'images/player1.png');
    this.load.image('face', 'images/face.png');
    console.log('hey');
  }
  create() {
    //defines our objects
    this.player1 = this.add.image(200, 200, 'player1');
    this.player1 = this.add.image(100, 200, 'player1');
    this.face = this.add.image(100, 200, 'face');
  }

  update() {
    //const running loop to check for updates or events (ex. checking for collision)
    // this.char.x += 4; // advances the character every update by 4 pixels, can add/subtract to change the speed
    // if (this.char.x > this.game.config.width) {
    //   this.char.x = 0; // checks if char goes off the edge
    // }
  }
}
