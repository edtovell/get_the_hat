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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var guy;
var game = new Phaser.Game(config);
var cursors;

const guyMoveSpeed = 100;


function preload() {
    this.load.spritesheet('guy', './assets/images/guy_spritesheet.png', {frameWidth: 32, frameHeight: 32});
    this.load.tilemapTiledJSON('map', './assets/images/maps/map1.json');
    this.load.image('tiles', './assets/images/tiles/tile_spritesheet.png');
    // for future reference: https://www.toptal.com/developers/css/sprite-generator/
}

function create() {

    //map & tiles    
    var map = this.make.tilemap({key: 'map'});
    var tiles = map.addTilesetImage('tile_spritesheet', 'tiles', 32, 32, 1, 2);
    var grass = map.createStaticLayer('grass', tiles);
    var obstacles = map.createStaticLayer('obstacles', tiles);
    obstacles.setCollisionByExclusion([-1]);

    //guy goes in middle, camera follows guy, 
    guy = this.physics.add.sprite(config.width/2, config.height/2,'guy', 0);
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
    cursors = this.input.keyboard.createCursorKeys();
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

function update() {
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
        // guy.body.setVelocityY(0);
        guy.body.setVelocityX(-guyMoveSpeed);
    } else if(cursors.right.isDown){
        // guy.body.setVelocityY(0);
        guy.setVelocityX(guyMoveSpeed);
    }

    if(cursors.up.isDown){
        // guy.body.setVelocityX(0);
        guy.body.setVelocityY(-guyMoveSpeed);
    } else if(cursors.down.isDown){
        // guy.body.setVelocityX(0);
        guy.body.setVelocityY(guyMoveSpeed);
    }
    
}
