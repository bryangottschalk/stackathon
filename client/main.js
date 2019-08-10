let game, ball;

const score = {
  player1: 0,
  player2: 0,
};

let playerOneState = {
  direction: null,
};
let playerTwoState = {
  direction: null,
};
window.onload = function() {
  const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    parent: 'phaser-game',
    scene: [SceneMain],
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
  };
  game = new Phaser.Game(config);
  console.log('TCL: window.onload -> game', game);
};
