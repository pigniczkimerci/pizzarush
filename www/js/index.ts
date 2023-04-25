import Phaser from 'phaser'
import Game from './scenes/Game'
import UI from './ui/UI'


let config  = {
    type: Phaser.CANVAS,
    scale: {
        /*mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,*/
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.RESIZE,
    },
   /* scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },*/
    pixelArt: true,
    physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 600 },
        debug: false
    }
    },
    scene: [Game, UI],
}
let game = new Phaser.Game(config);



export default game
