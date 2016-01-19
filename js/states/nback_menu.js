var nBack = nBack || {};

nBack.MainMenu = function() {};

nBack.MainMenu.prototype = {
    create: function() {
        this.game.stage.backgroundColor = '#707070';
        this.add.sprite(0, 0, 'menu-background');
        this.add.sprite(250, 40, 'nutribaby-logo')

        button_2back1 = this.game.add.button(250, 380, 'button-play', this.set2Back1, this);
    },
    update: function() {
        if( nBack_frames > 0) {
            this.game.state.start('Game');
        }
    },
    set2Back1: function() {
        nBack_frames = 2;
        nBack_colors = 1;
    }
}