var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true
        }
    },
    scene: [Start, Play]
    // scene: [Play]
};

var game = new Phaser.Game(config);
