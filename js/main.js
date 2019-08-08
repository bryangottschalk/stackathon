var game;
window.onload = function() {
  const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    parent: 'phaser-game',
    scene: [scene2],
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
  };
  game = new Phaser.Game(config);
};
