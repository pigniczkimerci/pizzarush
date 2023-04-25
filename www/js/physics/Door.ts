import Phaser, { Tilemaps } from 'phaser'
import Game from '../scenes/Game';
import Physics from './Physicss';
export default class DoorController extends Physics{
    private group: Phaser.Physics.Arcade.Group;
    private boardGroup: Phaser.Physics.Arcade.Group;
    private board!: Phaser.Physics.Arcade.Sprite;
    private _itemneed: number;
    private _i: number = 1;
    private _counter = 0;
    private _activeDoor: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any;
    public get activeDoor(): Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any {
        return this._activeDoor;
    }
    public set activeDoor(value: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any) {
        this._activeDoor = value;
    }
    public get itemneed(): number {
        return this._itemneed;
    }
    public set itemneed(value: number) {
        this._itemneed = value;
    }
    public get i(): number {
        return this._i;
    }
    public set i(value: number) {
        this._i = value;
    }
    public get counter(): number {
        return this._counter;
    }
    public set counter(value: number) {
        this._counter = value;
    }
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite) {
        super(game, scene,ground,deliveryboy);
        this._itemneed = 1;

        this.group = this.scene.physics.add.group({
            immovable: true
        });
        this.boardGroup = this.scene.physics.add.group({
            immovable: true
        });
        //sprite hozzáadása
        //@ts-ignore
        const doorObjects = this.scene.map.getObjectLayer('door').objects;
        doorObjects.map((door: { x: number; y: number; }) => {
            const doorSprite = this.scene.physics.add.sprite(door.x, door.y, 'door');
            this.group.add(doorSprite);
        });
        //@ts-ignore
        const boardObjects = this.scene.map.getObjectLayer("board").objects;
         for (const board of boardObjects) {
            this.board = this.scene.physics.add.sprite(board.x, board.y, 'board_'+ this.i);
            this.boardGroup.add(this.board)
            this.i++;
        }
        //ütközés megvalósítása
        this.scene.physics.add.collider(this.ground, this.group).name = "doorground";
        this.scene.physics.add.collider(this.ground, this.boardGroup);
        this.scene.physics.add.collider(this.deliveryboy, this.group, this.handlePlayerDoorCollide, undefined, this).name = "doordelivery";;
    }
    //játékos és az ajtó érintkezése
    handlePlayerDoorCollide(deliveryboy: any, item: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject) {
        if (this.activeDoor) {
            return
        }
        this.activeDoor = item
    }

    //activeDoor modosítása
    updateActiveDoor() {
        if (!this.activeDoor) {
            return false;
        }
        //ha érintekzik a játékos az ajtóval
        if (this.activeDoor.body.checkCollision) {
            return true;
        }
       
        this.activeDoor = undefined;
        return false;
    }
    //itemek updatelése
    updateItemsDoor() {
        if (this.activeDoor && this.updateActiveDoor()) {
            this.activeDoor.body.checkCollision.left = false;
            this.counter++;
            this.activeDoor = undefined
        }
        if (location.href.split("/").pop() === "intro.html") {
            window.alert("szép volt")
            window.location.replace("index.html");
            this.scene.game.destroy(true,false);
        }
        if (this.activeDoor == undefined) {
            this.counter = 0;
        }
    }
    updateDoor(){
        if(!this.activeDoor) return false;
        if(this.deliveryboy.body.position.x+100 !== this.activeDoor.body.position.x){
            this.activeDoor = undefined;
        }
        return true;
    }

}