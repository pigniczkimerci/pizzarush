import Game from "../scenes/Game";
export default class Physics{
    protected game: Game;
    protected scene: Phaser.Scene;
    protected ground!: Phaser.Tilemaps.TilemapLayer;
    protected deliveryboy!: Phaser.Physics.Arcade.Sprite;
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite){
        this.game = game;
        this.scene = scene;
        this.ground = ground;
        this.deliveryboy = deliveryboy;
    }
}