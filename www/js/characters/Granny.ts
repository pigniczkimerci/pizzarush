import Game from "../scenes/Game";
import Enemy from "./Enemy";
export default class GrannyController extends Enemy{
    private collider: Phaser.Physics.Arcade.Group;
    private _active: boolean = false;
    private _activeGranny: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject;
    public get activeGranny(): Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject {
        return this._activeGranny;
    }
    public set activeGranny(value: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject) {
        this._activeGranny = value;
    }

    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
    }
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer,  deliveryboy: Phaser.Physics.Arcade.Sprite) {
        super(game, scene, ground, deliveryboy, 100, 2);
        this.collider = this.scene.physics.add.group({
            immovable: true
        });
        //sprite hozzáadása
        //@ts-ignore
        const grannyObjects = this.scene.map.getObjectLayer('granny').objects;
        grannyObjects.map((granny: { x: number; y: number; }) => {
            const grannySprite = this.scene.physics.add.sprite(granny.x, granny.y, 'granny');
            this.collider.add(grannySprite);
        });
        //ütközés megvalósítása
        this.scene.physics.add.collider(this.collider, this.ground);
        this.scene.physics.add.collider(this.collider, this.collides)
        this.scene.physics.add.overlap(this.deliveryboy, this.collider, this.handlePlayerGrannyCollide, undefined, this);
    }
    //ütközéskor activeGranny
    handlePlayerGrannyCollide(deliveryboy: any, granny: Phaser.GameObjects.GameObject | Phaser.Physics.Arcade.Sprite | undefined) {
        if (this.activeGranny) {
            return
        }
        this.activeGranny = granny

    }
    //game.ts loop, activegranny updatelése
    updateColliderGranny() { 
        if (this.active) {
            this.active = false;
            return true;
        }
        return false;
    }
    updateActiveGranny() {
        if (!this.collider.children.entries) {
            return
        }
        //követés megvalósítása
        this.collider.children.entries.map(m => {
            const distance = Phaser.Math.Distance.Between(
                this.deliveryboy.x, this.deliveryboy.y,
                m.body.position.x, m.body.position.y
            )  
            //követés
            if (distance < 400) {
                if(m.body.position.x > this.deliveryboy.body.position.x){
                    m.body.gameObject.flipX = false;
                }else{
                    m.body.gameObject.flipX = true;
                }
                m.body.velocity.x = 60 * Math.sign(this.deliveryboy.x - m.body.position.x);
                m.body.gameObject.anims.play("granny_walk",true)
                if (this.activeGranny) {
                    this.active = true;
                    this.game.ui.setItem(-1);
                    m.destroy();
                    this.activeGranny = undefined;
                }
            }
            //követés leállítása
            if (distance > 400) {
                m.body.gameObject.anims.play("granny_walk",false)
                //@ts-ignore
                m.body.velocity.setTo(0, 0)
            }
        });
    }
}