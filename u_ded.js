class UDed extends Phaser.Scene {

    constructor () {
        super({key: "u_ded"})
    }

    create () {
        var title = this.add.text(
            config.width*.5,
            config.height*.5,
            'u ded',
            {
                fontSize: "20px",
                fontFamily: "Arial",
                color: "#f00",
            }
        );
        this.time.addEvent({
            delay:3000,
            callback: this.goToMenu,
            callbackScope: this,
        });
    }

    goToMenu () {
        this.scene.start("start");
    }
}