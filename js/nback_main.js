var nBack = nBack || {};

nBack.game = new Phaser.Game(800, 600,  Phaser.ScaleManager.SHOW_ALL, '');

var player;
var platforms;
var movingPlatforms;
var cursors;
var wasStanding = false;
var edgeTimer = 0;
var jumpTimer = 0;

var nutricomps;
var dangerBar;
var score = 0;
var scoreText;
var maxScore = 0;
var maxScoreText;
var heightScore;
var currentHeightText;
var topHeight = 10000;
var gameOverBool = false;

var nutribabyLogo;
var softtekLogo;
var pad;
var stick;
var nBack_frames = 0;

var facing = "right";

var nutriDeath;
var playerDeath;
var playerJump;
var bgmTiger;
        
nBack.game.state.add('Preload', nBack.Preload);
nBack.game.state.add('MainMenu', nBack.MainMenu);
nBack.game.state.add('Game', nBack.Game);

nBack.game.state.start('Preload');