import Game from "../scenes/Game";
import { shared } from "../config/EventEmitter"
let shoot: Phaser.Physics.Arcade.Group;
let nextFire = 0;
export default class Enemy {
    protected scene: Phaser.Scene;
    protected ground!: Phaser.Tilemaps.TilemapLayer;
    protected collides!: Phaser.Tilemaps.TilemapLayer;
    protected deliveryboy!: Phaser.Physics.Arcade.Sprite
    protected character!: Phaser.Physics.Arcade.Sprite;
    protected health: number;
    protected damage: number;
    protected game: Game;
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite, health: number, damage: number) {
        this.game = game;
        this.scene = scene;
        this.ground = ground;
        this.deliveryboy = deliveryboy;
        this.health = health;
        this.damage = damage;
    }
}