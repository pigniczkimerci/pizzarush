import Phaser from 'phaser'
import Game from '../scenes/Game';
import Physics from './Physicss';

export default class ObstacleController extends Physics{
    private group: Phaser.Physics.Arcade.Group;
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite) {
        super(game, scene,ground,deliveryboy);
        this.group = this.scene.physics.add.group({
            immovable: true
        });
        //sprite hozzáadása
        //@ts-ignore
        const obstacleObjects = this.scene.map.getObjectLayer('obstacle').objects;
        const obstacleSprites = obstacleObjects.map((obstacle: { x: number; y: number; }) => this.scene.physics.add.sprite(obstacle.x, obstacle.y, 'obstacle'));
        this.group.addMultiple(obstacleSprites);
        //ütközés megvalósítása
        this.scene.physics.add.collider(this.group, this.ground).name = "obstaclenground";
        this.scene.physics.add.collider(this.group, this.deliveryboy).name = "obstaclecollider";
    }
    
}