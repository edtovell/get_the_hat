class HUD extends Phaser.Scene {
    constructor() {
    	super({ key: "HUD" });
    }

    preload() {
    	this.anxietyVal = 0;
    }

    create() {
    	var cam = this.cameras.main;
    	this.anxietyText = this.add.text(
    		10,
    		10,
    		"",
    		{
                fontSize: "28px",
                fontFamily: "Courier",
            }
    	)
    	this.tooltip = this.add.text(
    		cam.midPoint.x,
    		cam.displayHeight*0.9,
    		"[space] to do stuff",
    		{
    			fontSize: "26px",
    			fontFamily: "Courier"
    		}
    	)
    	this.tooltip.setVisible(false);
    }

    update() {
    	this.anxietyVal+=Phaser.Math.Between(1,3);
    	this.anxietyText.setText("anxiety: " + this.anxietyVal/10 + "%");
    }
}