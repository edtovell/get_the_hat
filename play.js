class Play extends Phaser.Scene {

    constructor () {
        super({key: "play"})
    }

    preload () {
        this.load.spritesheet('guy', './assets/images/guy_spritesheet.png', {frameWidth: 32, frameHeight: 32});
        this.load.tilemapTiledJSON('map', './assets/images/maps/map1.json');
        this.load.image('tiles', './assets/images/tiles/tile_spritesheet.png');
        // for future reference: https://www.toptal.com/developers/css/sprite-generator/

        this.cursors = this.input.keyboard.createCursorKeys();
        this.guyMoveSpeed = 150;
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
        //guy animations
        var cursors = this.cursors;
        var guy = this.guy;
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
            // guy.body.setVelocityY(0);
            guy.body.setVelocityX(-this.guyMoveSpeed);
        } else if(cursors.right.isDown){
            // guy.body.setVelocityY(0);
            guy.setVelocityX(this.guyMoveSpeed);
        }

        if(cursors.up.isDown){
            // guy.body.setVelocityX(0);
            guy.body.setVelocityY(-this.guyMoveSpeed);
        } else if(cursors.down.isDown){
            // guy.body.setVelocityX(0);
            guy.body.setVelocityY(this.guyMoveSpeed);
        }

        if(cursors.space.isDown){
            guy.scaleDownDestroy()
        }
        
    }
}