class HUD extends Phaser.Scene {
    constructor() {
    	super({ key: "HUD" });
    }

    preload() {
    	this.anxietyVal = 0;
    }

    create() {
    	this.anxietyText = this.add.text(
    		10,
    		10,
    		"",
    		{
                fontSize: "28px",
                fontFamily: "Courier",
            }
    	) 
    }

    update() {
    	this.anxietyVal+=Phaser.Math.Between(1,3);
    	this.anxietyText.setText("anxiety: " + this.anxietyVal/10 + "%")
    }
}