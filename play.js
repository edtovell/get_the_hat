class Play extends Phaser.Scene {

    constructor() {
        super({ key: "play" });
        this.guyMoveSpeed = 150;
        this.T =32; // size of one tile
    }

    preload() {
        this.load.spritesheet('guy', './assets/images/guy/guy_spritesheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.tilemapTiledJSON('map', './assets/images/maps/map1.json');
        this.load.image('tiles', './assets/images/tiles/tile_spritesheet.png');
        this.load.image('red_dot', './assets/particles/red_dot.png');
        this.load.image('text_box', './assets/images/misc/textbox.png');
        this.load.spritesheet('wizard', './assets/images/npcs/wizard_spritesheet.png', { frameWidth: 32, frameHeight: 32 })
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.load.audio('music', './assets/sounds/dumb_song.wav');
        this.load.audio('die', './assets/sounds/die.wav');
        // for future reference: 
        //    spritesheets: https://www.toptal.com/developers/css/sprite-generator/
        //    music: https://beepbox.co/#8n31s1k0l00e0ft38m1a7g0fj07i0r1o3210T1v1L4u01q1d2f7y3z1C0c0A0F0B9V9Q0000Pe850E0141T1v1L4u01q1d1f7y4z1C1c0A1F9B4V1Q1003Pdb95E019bT0v0L3u00q1d3f8y1z1C2w2c3h0T4v1L4uf0q1z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00b8i4i4x4y8y80000N8Och000x8i4x8g004h4h4h4h000p23ELpuFhJCn866joE7XrsOZTmpIzZr1vZSVOnpX12cOpuu4Lp1sDv_siouUj-Hv_pHh4JhSXXlC2CIB6WL-GhIHIDiraHMgROkzjjvtjjyfinO918AcAhOdOlO9d8AQAjNaji9d94Qyjihh8AYyjOlVkB8OczpKfO2OddN_Fu2IXnYuTuKU_SBWrQvLnG2FIn-k-tvtNfkt_YKIAk0kQpQ1rsPhCpw5R5lRRStCttg0
    }

    create() {

        this.sound.play('music', { loop: true });

        //map & tiles    
        const T = this.T;
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('tile_spritesheet', 'tiles', T, T, 1, 2);
        var grass = map.createStaticLayer('grass', tiles);
        var obstacles = map.createStaticLayer('obstacles', tiles);
        obstacles.setCollisionByExclusion([-1]);

        function coord(n) {
            // returns x or y pixel values for tiled coordinates
            return T * n + (T / 2)
        }

        //guy goes in middle, camera follows guy,
        var guy =  this.physics.add.sprite(coord(15), coord(38), 'guy', 0);
        this.cameras.main.startFollow(guy);
        this.cameras.main.setZoom(2);
        this.cameras.main.roundPixels = true;

        //guy can't leave map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        guy.setCollideWorldBounds(true);

        //camera can't leave map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //guy can't go through stuff
        this.physics.add.collider(guy, obstacles);

        //guy animations
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('guy', { frames: [1, 2] }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('guy', { frames: [10, 11] }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'l/r',
            frames: this.anims.generateFrameNumbers('guy', { frames: [6, 7] }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('guy', { frames: [0, 3] }),
            frameRate: 5,
            repeat: -1
        });

        guy.anims.play('idle');
        guy.idle_counter = 0;
        guy.moveTarget = new Phaser.Math.Vector2(guy.x, guy.y);
        guy.isMoving = function() {return Boolean(guy.body.velocity.x || guy.body.velocity.y)}

        // there is a wizard
        var wizard = this.physics.add.sprite(coord(12), coord(36), "wizard", 0);
        wizard.body.immovable = true;
        this.anims.create({
            key: 'wizard',
            frames: this.anims.generateFrameNumbers('wizard', { frames: [1, 2] }),
            frameRate: 4,
            repeat: -1
        });
        this.physics.add.collider(guy, wizard);
        this.wizard = wizard;

        // config for controling dialog
        this.dialog = {
            box: {},
            text: "",
            textObject: {},
            textCounter: 0,
            active: false,
            canEnter: true,
            canExit: false
        };

        this.guy = guy;
    }

    update() {
        const T = this.T;
        var cursors = this.cursors;
        var guy = this.guy;

        // console.log("Velocity  x:" + guy.body.velocity.x + " y:" + guy.body.velocity.y);
        // console.log("Pos       x:" + guy.x + " y:" + guy.y);
        // console.log("Target    x:" + guy.moveTarget.x + " y:" + guy.moveTarget.y);
        // console.log("isMoving: " + guy.body.isMoving);

        if (guy.active) {
            guy.idle_counter++;

            if (!guy.isMoving()){
                //guy animations
                if (cursors.left.isDown) {
                    guy.anims.play('l/r', true);
                    guy.setFlipX(false);
                    guy.idle_counter = 0;
                } else if (cursors.right.isDown) {
                    guy.anims.play('l/r', true);
                    guy.setFlipX(true);
                    guy.idle_counter = 0;
                } else if (cursors.up.isDown) {
                    guy.anims.play('up', true);
                    guy.idle_counter = 0;
                } else if (cursors.down.isDown) {
                    guy.anims.play('down', true);
                    guy.idle_counter = 0;
                } else if (guy.idle_counter > 100) {
                    guy.anims.play("idle", true);
                } else {
                    guy.anims.stop();
                }
            }

            //guy movements
            if (guy.isMoving()) {
                // are we there yet?
                var v = guy.body.velocity;
                if (v.x < 0) {
                    // moving left
                    if (guy.x < guy.moveTarget.x){
                        // stop moving left
                        guy.setX(guy.moveTarget.x);
                        guy.body.setVelocity(0);
                    }
                }
                else if (v.x > 0) {
                    // moving right
                    if (guy.x > guy.moveTarget.x){
                        // stop moving right
                        guy.setX(guy.moveTarget.x);
                        guy.body.setVelocity(0);
                    }
                }
                else if (v.y < 0) {
                    // moving up
                    if (guy.y < guy.moveTarget.y){
                        // stop moving up
                        guy.setY(guy.moveTarget.y);
                        guy.body.setVelocity(0);
                    }
                }
                else if (v.y > 0) {
                    // moving down
                    if (guy.y > guy.moveTarget.y){
                        // stop moving down
                        guy.setY(guy.moveTarget.y);
                        guy.body.setVelocity(0);
                    }

                }
            } else {
                // enable movement controls
                if (cursors.left.isDown) {
                    guy.moveTarget.x -= T;
                    guy.body.setVelocityX(-this.guyMoveSpeed);
                } else if (cursors.right.isDown) {
                    guy.moveTarget.x += T;
                    guy.setVelocityX(+this.guyMoveSpeed);
                } else if (cursors.up.isDown) {
                    guy.moveTarget.y -= T;
                    guy.body.setVelocityY(-this.guyMoveSpeed);
                } else if (cursors.down.isDown) {
                    guy.moveTarget.y += T;
                    guy.body.setVelocityY(+this.guyMoveSpeed);
                } else {
                    guy.body.setVelocity(0);
                }
            }

            // press x to die
            if (cursors.x.isDown) {
                this.playerDies();
            }

        }

        // dialog controls
        if (this.dialog.active) {
            if (this.dialog.canSkip) {
                if (cursors.space.isDown) {
                    console.log("pressed space");

                }
            }
            if (this.dialog.canExit) {
                if (cursors.space.isDown) {
                    console.log('pressed space');
                    this.exitDialog();
                }
            }
        } else {
            if (this.dialog.canEnter) {
                if (cursors.space.isDown) {
                    console.log('pressed space');
                    this.enterDialog();
                    this.printDialog("Help, I'm trapped in a bad game! It smells funny in here and I'm tired.");
                }
            }
        }
        var wizard = this.wizard;
        wizard.body.setVelocity(0);
        wizard.anims.play('wizard', true);

    }

    enterDialog() {
        console.log('entered dialog');

        var box = this.add.image(0, 0, "text_box");

        console.log('drew box');
        // set the textbox to occupy the bottom quarter of the camera
        var cam = this.cameras.main;
        box.setPosition(cam.midPoint.x, cam.midPoint.y + (cam.displayHeight * 2 / 6));
        box.setDisplaySize(cam.displayWidth - 20, (cam.displayHeight / 3) - 20);

        console.log('repositioned box');

        // freeze the scene
        this.guy.setVelocity(0);
        this.guy.setActive(false);
        this.wizard.setActive(false);

        console.log('froze characters');

        // set dialog controls
        this.dialog.active = true;
        this.dialog.box = box;
        this.dialog.canEnter = false;
        this.dialog.canExit = false;
        // this.dialog.text = text;

        console.log('set dialog components');
        console.log(this.dialog);

        // display dialog
        var boxTopLeft = box.getTopLeft()
        var textObject = this.add.text(
            boxTopLeft.x + 12,
            boxTopLeft.y + 10,
            "", {
                fontSize: (box.height / 3) + "px",
                fontFamily: "Courier",
            }
        );
        this.dialog.textObject = textObject;
        this.dialog.textObject.setWordWrapWidth(box.displayWidth - 24);
        console.log('created a textObject');

        // enable controls to close dialog after 1.5 seconds
        this.time.addEvent({
            delay: 800,
            callback: function() {
                this.dialog.canExit = true;
                console.log("dialog.canExit = true");
            },
            callbackScope: this,
        });

        console.log("finished entering dialog");
    }

    printDialog(text) {
        this.time.addEvent({
            delay: 40,
            repeat: text.length,
            callback: function(){
                this.dialog.textObject.setText(text.slice(0, this.dialog.textCounter));
                this.dialog.textCounter++;
            },
            callbackScope: this,
        })
    }

    exitDialog() {
        console.log('exited dialog');

        // unfreeze the scene
        this.guy.setActive(true);
        this.wizard.setActive(true);
        console.log('reactivated characters');

        // unset dialog options
        this.dialog.box.destroy();
        console.log('destroyed dialog box');
        this.dialog.textObject.destroy();
        console.log('destroyed dialog textObject')
        this.dialog.text = "";
        this.dialog.active = false;
        this.dialog.textCounter = 0;
        console.log('reset dialog components');
        console.log(this.dialog);

        // enable controls to close dialog after 1 second
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                this.dialog.canEnter = true;
                console.log("dialog.canEnter = true");
            },
            callbackScope: this,
        })
    }

    playerDies() {
        this.sound.stopAll();
        this.wizard.setActive(false);

        this.guy.body.setVelocity(0);
        this.guy.anims.play("idle", true);
        this.guy.setActive(false);
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                var particles = this.add.particles("red_dot");
                var emitter = particles.createEmitter({
                    x: this.guy.x,
                    y: this.guy.y,
                    speed: { min: 10, max: 40 },
                    gravityY: 50,
                    lifespan: { min: 500, max: 2000 },
                    quantity: 100
                });
                this.guy.setVisible(false);
                emitter.explode();
                this.sound.play('die');
            },
            callbackScope: this,
        });
        this.time.addEvent({
            delay: 5000,
            callback: function() {
                this.scene.start("u_ded");
            },
            callbackScope: this,
        })
    }
}