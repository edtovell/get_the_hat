class Win extends Phaser.Scene {

    constructor () {
        super({key: "win"})
    }

    preload () {
        this.load.image('hatguy', './assets/images/guy/guy_with_hat.png');
        this.load.image('yellow_dot', './assets/particles/yellow_dot.png');
    }

    create () {
        var text = this.add.text(
            config.width*.2,
            config.height*.3,
            'you got the hat',
            {
                fontSize: "30px",
                fontFamily: "Courier",
            }
        );
        var yay = this.add.text(
            config.width*.1,
            config.height*.6,
            'yay',
            {
                fontSize: "16px",
                fontFamily: "Courier",
            }
        )

        let guyX = config.width*.8;
        let guyY = config.height*.7

        var particles = this.add.particles("yellow_dot");
        var emitter = particles.createEmitter({
            x: guyX,
            y: guyY,
            speed: { min: 40, max: 100 },
            lifespan: { min: 1500, max: 3000 },
            quantity: 150
        })
        // emitter.setScale(2);
        emitter.start();

        var guy = this.add.image(guyX, guyY, "hatguy");
        guy.setScale(5);
        this.guy = guy;


        this.cursors = this.input.keyboard.createCursorKeys();

        this.canRestart = false;
    }

    update () {
        if(this.canRestart){
            if(this.cursors.space.isDown){
                this.restart()
            }
        }
    }

    restart () {
        this.scene.start("start");
    }
}