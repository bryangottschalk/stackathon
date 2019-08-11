let game, ball;

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
        debug: true,
      },
    },
  };
  game = new Phaser.Game(config);
};

const noscroll = () => {
  window.scrollTo(0, 0);
};

window.addEventListener('scroll', noscroll);
