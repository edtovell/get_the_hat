class Play extends Phaser.Scene {

    constructor () {
        super({key: "play"});
        this.guyMoveSpeed = 150;
    }

    preload () {
        this.load.spritesheet('guy', './assets/images/guy_spritesheet.png', {frameWidth: 32, frameHeight: 32});
        this.load.tilemapTiledJSON('map', './assets/images/maps/map1.json');
        this.load.image('tiles', './assets/images/tiles/tile_spritesheet.png');
        this.load.image('red_dot', './assets/particles/red_dot.png');
        this.cursors = this.input.keyboard.createCursorKeys();
        // for future reference: https://www.toptal.com/developers/css/sprite-generator/
    }

    create () {

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
        
    }

    playerDies () {
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
        this.scene.start("start");
    }
}