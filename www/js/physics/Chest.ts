import Game from "../scenes/Game";
import Physics from "./Physicss";
export default class ChestController extends Physics{
    private group: Phaser.Physics.Arcade.Group;
    private itemGroup: Phaser.Physics.Arcade.Group;
    //private level!: number;
    private _items: number;
    private _y: number;
    private _item: any;
    private _activeChest!: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any;
    public get activeChest(): Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any {
        return this._activeChest;
    }
    public set activeChest(value: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any) {
        this._activeChest = value;
    }
    public get items(): number {
        return this._items;
    }
    public set items(value: number) {
        this._items = value;
    }
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }
    public get item(): any {
        return this._item;
    }
    public set item(value: any) {
        this._item = value;
    }
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite) {
        super(game, scene,ground,deliveryboy);
        this._items = 0;
        this.group = this.scene.physics.add.group({
            immovable: true
        });
        this.itemGroup = this.scene.physics.add.group();
        //sprite hozzáadása
        //@ts-ignore
        const chestObjects = this.scene.map.getObjectLayer('chest').objects;
        chestObjects.map((chest: { x: number; y: number; }) => {
            const chestSprite = this.scene.physics.add.sprite(chest.x, chest.y, 'chest');
            this.group.add(chestSprite);
        });
        //ütközés megvalósítása
        this.scene.physics.add.collider(this.group, this.ground);
        this.scene.physics.add.collider(this.deliveryboy, this.group, this.handlePlayerChestCollide, undefined, this);
    }
    //játékos és a láda érintkezése
    handlePlayerChestCollide(deliveryboy: any, chest: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject) {
        if (this.activeChest) {
            return
        }
        this.activeChest = chest
        this.activeChest!.setData('itemSize', this.game.level* 2)
    }
    //láda kinyitása
    openChest(chest: Phaser.Physics.Arcade.Sprite) {
        if (!chest) {
            return
        }
        const toppings = ["bacon", "cheese", "tomato", "sausages"];
        const itemSize = chest.getData('itemSize')
        if (!chest.getData('opened')) {
            for (let i = 0; i < itemSize; i++) {
                const elem = Phaser.Math.RND.pick(toppings);
                this.item = this.group.get(chest.body.x + 20 + (i * 15), chest.body.y - 10, elem);
                this.item.body.checkCollision = false;
                this.item.body.allowGravity = false;   
                this.itemGroup.add(this.item);
                this.scene.physics.moveTo(this.item, chest.x, chest.y-200, 200);
                this.item.checkCollision = false;
                this.y = chest.y;
            }
            this.items += itemSize;
            this.game.ui.setItem(this.items);
            chest.anims.play("chest_open")
        }
        chest.setData('opened', true);
        this.activeChest = undefined;
    }
    //activeChest beálítása
    updateActiveChest() {
        if (this.activeChest == undefined) {
            return
        }
        if (this.activeChest.body.checkCollision) {
            this.openChest(this.activeChest);
        }
        this.activeChest = undefined;
    }
    //itemek eltávolítása
    removeItem(items: number) {
        this.items = items
    }
    deleteItem(){
        if(this.itemGroup.children.entries.length > 0){  
            this.itemGroup.children.entries.forEach((item: Phaser.Physics.Arcade.Sprite) => {
                if (item.body.position.y > this.y - 45) {
                    item.destroy();
                }
            });
        }
    }
}