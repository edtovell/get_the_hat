class Play extends Phaser.Scene {

    constructor () {
        super({key: "play"});
        this.guyMoveSpeed = 150;
    }

    preload () {
        this.load.spritesheet('guy', './assets/images/guy/guy_spritesheet.png', {frameWidth: 32, frameHeight: 32});
        this.load.tilemapTiledJSON('map', './assets/images/maps/map1.json');
        this.load.image('tiles', './assets/images/tiles/tile_spritesheet.png');
        this.load.image('red_dot', './assets/particles/red_dot.png');
        this.load.spritesheet('wizard', './assets/images/npcs/wizard_spritesheet.png', {frameWidth: 32, frameHeight: 32})
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.audio('music', './assets/sounds/dumb_song.wav');
        this.load.audio('die', './assets/sounds/die.wav');
        // for future reference: 
        //    spritesheets: https://www.toptal.com/developers/css/sprite-generator/
        //    music: https://beepbox.co/#8n31s1k0l00e0ft38m1a7g0fj07i0r1o3210T1v1L4u01q1d2f7y3z1C0c0A0F0B9V9Q0000Pe850E0141T1v1L4u01q1d1f7y4z1C1c0A1F9B4V1Q1003Pdb95E019bT0v0L3u00q1d3f8y1z1C2w2c3h0T4v1L4uf0q1z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00b8i4i4x4y8y80000N8Och000x8i4x8g004h4h4h4h000p23ELpuFhJCn866joE7XrsOZTmpIzZr1vZSVOnpX12cOpuu4Lp1sDv_siouUj-Hv_pHh4JhSXXlC2CIB6WL-GhIHIDiraHMgROkzjjvtjjyfinO918AcAhOdOlO9d8AQAjNaji9d94Qyjihh8AYyjOlVkB8OczpKfO2OddN_Fu2IXnYuTuKU_SBWrQvLnG2FIn-k-tvtNfkt_YKIAk0kQpQ1rsPhCpw5R5lRRStCttg0
    }

    create () {

        this.sound.play('music', {loop: true});

        //map & tiles    
        var map = this.make.tilemap({key: 'map'});
        var tiles = map.addTilesetImage('tile_spritesheet', 'tiles', 32, 32, 1, 2);
        var grass = map.createStaticLayer('grass', tiles);
        var obstacles = map.createStaticLayer('obstacles', tiles);
        obstacles.setCollisionByExclusion([-1]);

        //guy goes in middle, camera follows guy,
        this.guy = this.physics.add.sprite(config.width/2, config.height/2,'guy', 0);
        var guy = this.guy;
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
            frames: this.anims.generateFrameNumbers('guy', {frames: [1,2]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('guy', {frames: [10,11]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'l/r',
            frames: this.anims.generateFrameNumbers('guy', {frames: [6,7]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('guy', {frames: [0,3]}),
            frameRate: 5,
            repeat: -1
        });

        // there is a wizard
        this.wizard = this.physics.add.sprite(200, 200, "wizard", 0);
        this.wizard.body.static = true;
        this.anims.create({
            key: 'wizard',
            frames: this.anims.generateFrameNumbers('wizard', {frames: [2,3]}),
            frameRate: 4,
            repeat: -1
        });
        this.physics.add.collider(guy, this.wizard);
    }

    update () {
        var cursors = this.cursors;
        var guy = this.guy;
        
        if(guy.active){
            //guy animations
            if(cursors.left.isDown){
                guy.anims.play('l/r', true);
                guy.flipX = false;
            } else if(cursors.right.isDown){
                guy.anims.play('l/r', true);
                guy.flipX = true;
            } else if(cursors.up.isDown){
                guy.anims.play('up', true);
            } else if(cursors.down.isDown){
                guy.anims.play('down', true);
            } else {
                guy.anims.play('idle', true);
            }

            //guy movements
            guy.body.setVelocity(0);
            if(cursors.left.isDown){
                guy.body.setVelocityX(-this.guyMoveSpeed);
            } else if(cursors.right.isDown){
                guy.setVelocityX(this.guyMoveSpeed);
            }
            if(cursors.up.isDown){
                guy.body.setVelocityY(-this.guyMoveSpeed);
            } else if(cursors.down.isDown){
                guy.body.setVelocityY(this.guyMoveSpeed);
            }

            if(cursors.space.isDown){
                this.playerDies();
            }
        }

        this.wizard.body.setVelocity(0);
        this.wizard.anims.play('wizard', true);
        
    }

    playerDies () {
        this.sound.stopAll();

        this.guy.body.setVelocity(0);
        this.guy.anims.play("idle", true);
        this.guy.setActive(false);
        this.time.addEvent({
            delay:1000,
            callback: function() {
                var particles = this.add.particles("red_dot");
                var emitter = particles.createEmitter({
                    x: this.guy.x,
                    y: this.guy.y,
                    speed: {min: 10, max: 40},
                    gravityY: 50,
                    lifespan: {min: 500, max: 2000},
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
            callback: this.returnToMenu,
            callbackScope: this,
        })
    }

    returnToMenu () {
        this.scene.start("u_ded");
    }
}