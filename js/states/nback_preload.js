var nBack = nBack || {};

nBack.init = function() {};
nBack.Preload = function() {};

nBack.Preload.prototype = {
    init: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    preload: function() {
        //Main Game Assets
        this.load.image('sky', 'assets/images/sky.png');
        this.load.image('ground', 'assets/images/platform_1.png');
        this.load.image('groundBackground', 'assets/images/ground-decoration.jpg');
        this.load.image('skyBackground', 'assets/images/background-sky.png');
        this.load.image('backgroundClouds', 'assets/images/background-clouds.png');
        this.load.image('nutricomp-apple', 'assets/images/nutricomp-apple.png');
        this.load.image('nutricomp-mix', 'assets/images/nutricomp-mix.png');
        this.load.image('nutricomp-pear', 'assets/images/nutricomp-pear.png');
        this.load.spritesheet('tiger', 'assets/images/tigerSS.png', 46, 39);
        this.load.image('platform', 'assets/images/grass-platform.png');
        this.load.image('ice-platform', 'assets/images/frost-platform.png');
        this.load.image('nutricomp-logo', 'assets/images/nutribaby-logo.png');
        this.load.image('softtek-logo', 'assets/images/softtek-logo.png');
        this.load.image('danger-line', 'assets/images/danger-line.png');
        //this.load.atlas('arcade', 'assets/virtualjoystick/skins/arcade-joystick.png', 'assets/virtualjoystick/skins/arcade-joystick.json');
        this.load.atlas('dpad', 'assets/virtualjoystick/skins/dpad.png', 'assets/virtualjoystick/skins/dpad.json');

        //Menu Assets
        this.load.image('menu-background',    'assets/images/main-background.png');
        this.load.image('button-play',    'assets/images/button-play.png');
        this.load.image('loading',  'assets/images/load-bar.png');
        this.load.image('nutribaby-logo',    'assets/images/splashscreen.png');

        //Audio Assets
        this.load.audio('nutri-death','assets/audio/death_nutri.wav');
        this.load.audio('player-death','assets/audio/death_player.wav');
        this.load.audio('player-jump','assets/audio/jump_player.wav');
        this.load.audio('bgm-tiger','assets/audio/bgm_tiger.wav');
    },
    create: function() {
        this.state.start('MainMenu');
    }
};