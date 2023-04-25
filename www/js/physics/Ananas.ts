import Phaser, { Tilemaps } from 'phaser'
import Game from '../scenes/Game';
import Physics from './Physicss';

export default class ChestController extends Physics{
    private collider!: Phaser.Physics.Arcade.Collider;
    private group: Phaser.Physics.Arcade.Group;
    private _activeAnanas: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject;
    public get activeAnanas(): Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject {
        return this._activeAnanas;
    }
    public set activeAnanas(value: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject) {
        this._activeAnanas = value;
    }
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite) {
        super(game, scene,ground,deliveryboy);
        this.group = this.scene.physics.add.group({
            immovable: true
        });
        //sprite hozzáadása
        //@ts-ignore
        const ananasObjects = this.scene.map.getObjectLayer('ananas').objects;
        ananasObjects.map((ananas: { x: number; y: number; }) => {
            const ananasSprite = this.scene.physics.add.sprite(ananas.x, ananas.y, 'ananas');
            this.group.add(ananasSprite);
        });
        //ütközés megvalósítása
        this.scene.physics.add.collider(this.group, this.ground).name = "ananasnground";
        this.collider = this.scene.physics.add.collider( this.group,this.deliveryboy,this.handlePlayerItemCollide, undefined, this)
        this.collider.name = "ananascollider";
    }
    //játékos és az ananász ütközése esetén activeAnanas
    handlePlayerItemCollide(deliveryboy: any, item: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject)
	{
		if (item)
		{   
			//this.game.ui.setHealth(-1);
            this.game.playercontroller?.setHealth(-1)
		}
	}
}