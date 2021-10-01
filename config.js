import scene from './scene.js';
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics:{
    	default: 'arcade',
        arcade:{
        gravity:{y:0}
        }
    },
    scene:[scene]
};

new Phaser.Game(config);