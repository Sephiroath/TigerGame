var nBack = nBack || {};

nBack.Game = function() {};

nBack.Game.prototype = {
    create: function() {
        this.stage.backgroundColor = '#2f9acc';

        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Activacion de fisicas Arcade
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.world.setBounds(0, 0, 800, 10000);

        //  primer Fondo del juego
        this.game.add.sprite(0, this.game.world.height-177, 'groundBackground');

        //Fondo sucesivo del cielo
        for (var i = 1; i <= 100; i++) {
            this.game.add.sprite(0, this.game.world.height-177-(106*i), 'skyBackground');
        };
        for (var i = 1; i <= 3; i++) {
            this.game.add.sprite(0, this.game.world.height-306-(1200*i), 'backgroundClouds');
        };

        //  Grupo de plataformas iniciales a las cuales se puede saltar
        platforms = this.game.add.group();

        //  activa Physics a los elementos del grupo platforms
        platforms.enableBody = true;

        //en esta linea se crea el piso donde inicia el personaje
        var ground = platforms.create(0, this.game.world.height - 64, 'ground');

        //  se escala el sprite para que ocupe la pantalla
        ground.scale.setTo(2, 2);

        //  no se permite el movimiengto cuando es tocado por el personaje
        ground.body.immovable = true;

        //  se crean 2 bordes
        var ledge = platforms.create(400, this.game.world.height-200, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, this.game.world.height-350, 'ground');
        ledge.body.immovable = true;

        //creacion de plataformas con movimiento
        movingPlatforms = this.game.add.physicsGroup();

        var x = 0;
        var y = 64;

        for (var i = 0; i < 80; i++)
        {
            var type = i % 2 === 1 ? 'platform' : 'ice-platform';
            var movingPlatform = movingPlatforms.create(x, y, type);

            movingPlatform.scale.setTo(0.5, 0.5);

            //  Set a random speed between 50 and 150
            //movingPlatform.body.velocity.x = this.game.rnd.integerInRange(50, 150);
            //  Increase Speed gradually
            movingPlatform.body.velocity.x = this.game.rnd.integerInRange(900, 1050) - (10 * i)

            //  Inverse it?
            if (Math.random() > 0.5)
            {
                movingPlatform.body.velocity.x *= -1;
            }

            x += 200;

            if (x >= 600)
            {
                x = 0;
            }

            y+= 120;
        }

        movingPlatforms.setAll('body.allowGravity', false);
        movingPlatforms.setAll('body.immovable', true);

        // se agrega el jugador y su posicion incial
        player = this.game.add.sprite(32, this.game.world.height - 150, 'tiger');

        //  se le agregan fisicas al personaje principial
        this.game.physics.arcade.enable(player);

        //  se le da un pequeño rebote al personaje cuando toque el piso y se le activa la colision con los objetos
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Animaciones de caminar izq y der
        player.animations.add('left', [ 43, 42, 41, 40, 39, 38, 37 ,36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22], 20, true);
        player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 20, true);

        //  Finally some nutricomps to collect
        nutricomps = this.game.add.group();

        //  We will enable physics for any nutricomp that is created in this group
        nutricomps.enableBody = true;

        //loop de Generacion de nutricomp
        //this.game.time.events.repeat(Phaser.Timer.SECOND * 1, 10, this.createNutriComp, this);
        this.game.time.events.loop(Phaser.Timer.SECOND*5, this.createNutriComp, this);

        //Danger line: se añade linea que al pasarla mata al player
        dangerBar = this.game.add.sprite(0, this.game.world.height, 'danger-line');
        this.game.physics.arcade.enable(dangerBar);
        dangerBar.body.velocity.y = -15;
        dangerBar.body.allowGravity = false;
        dangerBar.body.immovable = true;
        this.game.time.events.loop(Phaser.Timer.SECOND*1, this.increaseDangerBarVelocity, this);;
        
        //Nutricomp Logo
        nutribabyLogo = this.game.add.sprite(800-200, 600-64, 'nutricomp-logo');
        //nutribabyLogo.scale.setTo(0.5,0.5);
        nutribabyLogo.fixedToCamera = true;

        //Softtek Logo
        softtekLogo = this.game.add.sprite(0, 600-64, 'softtek-logo');
        //softtekLogo.scale.setTo(0.5,0.5);
        softtekLogo.fixedToCamera = true;

        //  The score
        scoreText = this.game.add.text(16, 16, 'Puntuacion: 0', { fontSize: '16px', fill: '#000' });
        scoreText.fixedToCamera = true;

        //Maximum Score
        maxScoreText = this.game.add.text(16, 32, 'Puntuacion maxima: ' + maxScore, { fontSize: '16px', fill: '#000' });
        maxScoreText.fixedToCamera = true;
        
        //current Height 
        currentHeightText = this.game.add.text(16, 48, 'Altura actual: 0', { fontSize: '16px', fill: '#000' });
        currentHeightText.fixedToCamera = true;

        //Maximum Height
        heightScore = this.game.add.text(16, 64, 'Altura maxima: 0', { fontSize: '16px', fill: '#000' });
        heightScore.fixedToCamera = true;

        //Follow¨Player
        this.game.camera.follow(player);

        //  Our controls.
        cursors = this.game.input.keyboard.createCursorKeys();
        // Joystick Controls
        pad = this.game.plugins.add(Phaser.VirtualJoystick);

        //stick = pad.addStick(0, 0, 200, 'arcade');
        //stick.showOnTouch = true;
        stick = pad.addDPad(0, 0, 200, 'dpad');
        stick.showOnTouch = true;
        //stick.alignBottomLeft(0);
    },
    update: function() {
        movingPlatforms.forEach(this.wrapPlatform);
        if (this.spacebar.isDown && gameOverBool){
            gameOverBool = false;
            this.game.state.restart();
        }      
        // performance decrease
        //nutricomps.forEach(killOffscreenNutricomps);
        
        //Height Score
        this.heightUpdate();

        this.game.physics.arcade.collide(player, movingPlatforms, this.setFriction, null, this);
        this.game.physics.arcade.collide(player, platforms, this.setFriction, null, this);

        //  Do this AFTER the collide check, or we won't have blocked/touching set
        var standing = player.body.blocked.down || player.body.touching.down;

        //  Collide the player and the nutricomps with the platforms
        this.game.physics.arcade.collide(player, platforms);
        this.game.physics.arcade.collide(nutricomps, movingPlatforms);
        this.game.physics.arcade.collide(nutricomps, platforms, this.nutricompfloor);

        //  Checks to see if the player overlaps with any of the nutricomps, if he does call the this.collectnutricomp function
        this.game.physics.arcade.overlap(player, nutricomps, this.collectnutricomp, null, this);
        this.game.physics.arcade.overlap(player, dangerBar, this.killPlayer, null, this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        if(cursors.left.isDown || cursors.right.isDown || stick.isDown){ 
            if (cursors.left.isDown || stick.direction === Phaser.LEFT)
            {
                this.playerMoveLeft();
            }
            else if (cursors.right.isDown || stick.direction === Phaser.RIGHT)
            {
                this.playerMoveRight();
            }
            else
            {
                //  Stand still
                player.frame = 0;

                if (facing === 'right')
                {
                    player.frame = 0;
                }
                else
                {
                    player.frame = 43;
                }
            }
        }
        else
        {
            //  Stand still
            player.frame = 0;

            if (facing === 'right')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 43;
            }
        }
        
        //  Allow the player to jump if they are touching the ground.
        //if (cursors.up.isDown && player.body.touching.down)
        //{
        //    player.body.velocity.y = -350;
        //}
        //
        //  Change on jump movement:
        //  No longer standing on the edge, but were
        //  Give them a 250ms grace period to jump after falling
        if (!standing && this.game.wasStanding)
        {
            this.game.edgeTimer = this.game.time.time + 250;
        }

        //  Allowed to jump?
        if ((standing || this.game.time.time <= this.game.edgeTimer) && (cursors.up.isDown || stick.direction === Phaser.UP) && this.game.time.time > jumpTimer)
        {
            player.body.velocity.y = -500;
            jumpTimer = this.game.time.time + 750;
        }else if(cursors.down.isDown || stick.direction === Phaser.DOWN){
            player.body.velocity.y = 400;
        }

        this.game.wasStanding = standing;
    },
    playerMoveLeft: function(){
        //  Move to the left
        player.body.velocity.x = -250;
        if (facing !== 'left')
        {
            facing = 'left';
        }
        player.animations.play('left');
    },

    playerMoveRight: function(){
        //  Move to the right
        player.body.velocity.x = 250;
        if (facing !== 'right')
        {
            facing = 'right';
        }
        player.animations.play('right');
    },

    heightUpdate: function(){
        if(player.body.y < topHeight){
            topHeight = Math.floor(player.body.y);
        }
        heightScore.text = 'Altura maxima: ' + (this.game.world.height - topHeight - 150);
        currentHeightText.text = 'Altura actual: ' + (Math.floor(this.game.world.height - player.body.y - 102));
    },

    collectnutricomp: function(player, nutricomp) {
        
        // Removes the nutricomp from the screen
        nutricomp.kill();

        var heightValue, nutricompValue;
        nutricompValue = 0;
        heightValue = Math.floor(this.game.world.height - player.body.y - 102);
        for(i = 0; i<heightValue; i+=500){
            nutricompValue += 10;
        }

        score += nutricompValue;
        scoreText.text = 'Puntuacion: ' + score;
    },

    nutricompfloor: function(nutricomp, platform) {
        
        // Removes the nutricomp from the screen
        nutricomp.kill();

    },

    killPlayer: function(){
        player.kill();
        gameOverText = this.game.add.text(180, 200, 'JUEGO TERMINADO\nPresione ESPACIO para reiniciar', { fontSize: '32px', fill: '#000', align: 'center' });
        gameOverText.fixedToCamera = true;
        dangerBar.body.velocity.y = 0;
        gameOverBool = true;
        if(score === undefined){maxScore = 0;}
        if(score > maxScore){maxScore = score;}
        score = 0;
        maxScoreText.text = "Puntuacion maxima: " + maxScore
        //this.game.state.restart();
    },

    createNutriComp: function() {

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 4; i++)
        {
            //  Create a random nutricomp inside of the 'nutricomps' group
            var nutricompType = Math.floor(Math.random() * (3) + 1);
            var nutricomp;
            switch(nutricompType){
                case 1:
                    nutricomp = nutricomps.create(this.game.world.randomX, player.body.y-700, 'nutricomp-apple');
                    break;
                case 2:
                    nutricomp = nutricomps.create(this.game.world.randomX, player.body.y-700, 'nutricomp-mix');
                    break;
                case 3:
                    nutricomp = nutricomps.create(this.game.world.randomX, player.body.y-700, 'nutricomp-pear');
                    break;
                default: 
                    nutricomp = nutricomps.create(this.game.world.randomX, player.body.y-700, 'nutricomp-pear');
                    break;
            }
            

            //  Let gravity do its thing
            nutricomp.body.gravity.y = 50;
            nutricomp.body.collideWorldBounds = true;
            nutricomp.lifespan=10000;

            //  This just gives each nutricomp a slightly random bounce value
            nutricomp.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

    },

    render: function() {

        //this.game.debug.cameraInfo(this.game.camera, 32, 32);
        //this.game.debug.spriteCoords(player, 32, 500);

    },

    increaseDangerBarVelocity: function(){
        if(!gameOverBool){
            dangerBar.body.velocity.y -= 2;
        }
    },

    wrapPlatform: function(movingPlatform) {

        if (movingPlatform.body.velocity.x < 0 && movingPlatform.x <= -200)
        {
            movingPlatform.x = 800;
        }
        else if (movingPlatform.body.velocity.x > 0 && movingPlatform.x >= 800)
        {
            movingPlatform.x = -200;
        }

    },

    killOffscreenNutricomps: function(nutricomp) {
        console.log("Killed Nutricomp");
        if (nutricomp.body.velocity.x < 0 && nutricomp.x <= -200)
        {
            nutricomp.kill();
        }
        else if (nutricomp.body.velocity.x > 0 && nutricomp.x >= 800)
        {
            nutricomp.kill();
        }

    },

    setFriction: function(player, movingPlatform) {

        if (movingPlatform.key === 'ice-platform')
        {
            player.body.x -= movingPlatform.body.x - movingPlatform.body.prev.x;
        }

    }

}