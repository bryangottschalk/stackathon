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
        debug: true,
      },
    },
  };
  game = new Phaser.Game(config);
};
