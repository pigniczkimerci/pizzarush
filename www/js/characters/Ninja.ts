import Game from "../scenes/Game";
import Enemy from "./Enemy";
export default class NinjaController extends Enemy {
    private hb!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
    private hbgroup: Phaser.Physics.Arcade.Group;
    private collider: Phaser.Physics.Arcade.Group;
    private _activeNinja: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any;
    private _activeHitNinja: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any;
    private _control = false;
    public get activeHitNinja(): Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any {
        return this._activeHitNinja;
    }
    public set activeHitNinja(value: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any) {
        this._activeHitNinja = value;
    }
    public get control() {
        return this._control;
    }
    public set control(value) {
        this._control = value;
    }
    public get activeNinja(): Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any {
        return this._activeNinja;
    }
    public set activeNinja(value: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject | any) {
        this._activeNinja = value;
    }
    
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite) {
        super(game, scene,ground, deliveryboy, 100, 2);
        this.deliveryboy = deliveryboy;
        this.collider = this.scene.physics.add.group({
            immovable: true
        });
        this.hbgroup = this.scene.physics.add.group({
            immovable: true,
            allowGravity: false
        });
        //sprite hozzáadása
        //@ts-ignore
        const ninjaObjects = this.scene.map.getObjectLayer('ninja').objects;
        ninjaObjects.forEach((ninja: any) => {
            const ninjaSprite = this.scene.physics.add.sprite(ninja.x, ninja.y, 'ninja');
            ninjaSprite.setData('health', 100);
            this.hb = this.scene.physics.add.sprite(ninja.x, ninja.y - 60, 'healthbar').setScale(0.2);
            this.hb.visible = false;
            this.collider.add(ninjaSprite)
            this.hbgroup.add(this.hb)
        });
        //ütközés megvalósítása
        this.scene.physics.add.collider(this.collider, this.ground);
        this.scene.physics.add.collider(this.collider, this.collides);
        this.scene.physics.add.overlap(deliveryboy, this.collider, this.handlePlayerNinjaCollide, undefined, this);
    }
     //ütközéskor activeNinja
     handlePlayerNinjaCollide(deliveryboy: any, ninja: Phaser.GameObjects.GameObject | Phaser.Physics.Arcade.Sprite | undefined) {
        if (this.activeNinja) {
            return
        }
        this.activeNinja = ninja
    }
    //game loop
    updateHealth() {
        if (!this.collider.children.entries) {
            return
        }
        let deliveryboyX = this.deliveryboy.x;
        let deliveryboyY = this.deliveryboy.y;
        
        if (this.activeNinja) {
            //@ts-ignore
            //this.game.ui.setHealth(-this.game.level/100);
            this.game.playercontroller?.setHealth(-this.game.level/100);
            //shared.emit('setHealth', -this.scene.level/100)
        }
        //bizonyos távolság után az activeNinja törlődjön
        //ez a támadáshoz szükséges
        if (this.activeHitNinja) {
            const distance = Phaser.Math.Distance.Between(
                this.deliveryboy.x, this.deliveryboy.y,
                this.activeHitNinja.body.position.x, this.activeHitNinja.body.position.y
            )
            if (distance > 300) {
                this.control = false;
                this.activeHitNinja = undefined;
            }
        }
        //ninja követése
        this.collider.children.entries.map(m => {
            const distance = Phaser.Math.Distance.Between(
                this.deliveryboy.x, this.deliveryboy.y,
                m.body.position.x, m.body.position.y
            )
            //követés
            if (distance < 300 && this.hb) {
                this.hb.visible = true;
                this.follow(m,true);
                if(m.body.position.x > this.deliveryboy.body.position.x){
                    m.body.gameObject.flipX = true;
                }else{
                    m.body.gameObject.flipX = false;
                }
                this.hbgroup.children.entries.map(hb => {
                    hb.body.position.x = m.body.position.x
                    hb.body.position.y = m.body.position.y - 20
                })
            }
            //követés leállítása
            else if (distance > 300 || distance < 60) {
                this.follow(m, false)
            }
        });
        this.activeNinja = undefined;
    }
    follow(ninja: Phaser.GameObjects.GameObject | any, move: boolean){
        if(move){
            this.scene.physics.moveToObject(ninja, this.deliveryboy, 120);
            ninja.body.gameObject.anims.play("ninja_walk", true);
            this.hitEnemy(ninja);
        }else{
            ninja.body.gameObject.anims.play("ninja_walk", false);
            ninja.body.velocity.setTo(0, 0);
        }
    }
    //támadás
    hitEnemy(enemy: Phaser.Physics.Arcade.Sprite | undefined) {
        if (!enemy) return
        this.activeHitNinja = enemy;
        let size = this.activeHitNinja!.getData('health') / 500; //0,16
        this.hb!.setScale(size, 0.2)
        if (!this.control) {
            this.activeHitNinja!.setInteractive().on('pointerup', () => {
                if(this.activeHitNinja?.body.touching.left || this.activeHitNinja?.body.touching.right){
                    this.activeHitNinja!.setData('health', this.activeHitNinja!.getData('health') - 20)
                    this.hb!.setScale(size, 0.2)
                    size -= 0.04;
                    if (this.activeHitNinja!.getData('health') <= 0) {
                        this.activeHitNinja!.destroy();
                        this.hb!.setScale(0, 0)
                        this.activeHitNinja = undefined;
                        //shared.emit('setTp', 1)
                        this.game.playercontroller?.setTp(1);
                        this.control = false;
                    }
                }
            })
            this.control = true;
        }
    }


}