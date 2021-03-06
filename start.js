class Start extends Phaser.Scene {

    constructor () {
        super({key: "start"})
    }

    create () {
        var title = this.add.text(
            config.width*.3,
            config.height*.3,
            'get the hat',
            {
                fontSize: "30px",
                fontFamily: "Courier",
            }
        );
        this.time.addEvent({
            delay:3000,
            callback: this.start_game,
            callbackScope: this,
        });
    }

    start_game () {
        if(this.scene.isActive('play')){
            this.scene.stop('play');
        }
        this.scene.start("play");
    }
}