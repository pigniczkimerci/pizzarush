import Game from "../scenes/Game";
import Enemy from "./Enemy";
export default class HunterController extends Enemy{
    private hb!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private hbgroup: Phaser.Physics.Arcade.Group;
    private collider: Phaser.Physics.Arcade.Group;
    private hit: number = -5;
    private _counter: number = 0;
    private _control: boolean = false;
    private nextFire:number = 0;
    private _size: number;
    public get size(): number {
        return this._size;
    }
    public set size(value: number) {
        this._size = value;
    }
    private _activeHunter: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject;
    public get activeHunter(): Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject {
        return this._activeHunter;
    }
    public set activeHunter(value: Phaser.Physics.Arcade.Sprite | undefined | Phaser.GameObjects.GameObject) {
        this._activeHunter = value;
    }
    public get control(): boolean {
        return this._control;
    }
    public set control(value: boolean) {
        this._control = value;
    }
    public get counter(): number {
        return this._counter;
    }
    public set counter(value: number) {
        this._counter = value;
    }
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite) {
        super(game,scene,ground, deliveryboy, 100, 2);
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
        const hunterObjects = this.scene.map.getObjectLayer('hunter').objects;
        hunterObjects.forEach((hunter: any) => {
            const hunterSprite = this.scene.physics.add.sprite(hunter.x, hunter.y, 'hunter');
            hunterSprite.setData('health', 100);
            this.hb = this.scene.physics.add.sprite(hunter.x, hunter.y - 60, 'healthbar').setScale(0.2);
            this.hb.visible = false;
            this.collider.add(hunterSprite)
            this.hbgroup.add(this.hb)
        });
        //ütközés megvalósítása
        this.scene.physics.add.collider(this.collider, this.ground);
        this.scene.physics.add.collider(this.collider, this.collides);
        this.scene.physics.add.overlap(this.deliveryboy, this.collider);
    }
    hitPlayer(_eliveryboy: any, shoot: { destroy: () => void; }) {
        if (shoot) {
            shoot.destroy();
            //@ts-ignore
            //shared.emit('setHealth', hit - (this.scene.level / 10))
            //this.game.ui.setHealth(this.hit - (this.game.level / 10));
            this.game.playercontroller!.setHealth(this.hit - (this.game.level / 10));
        }
    }
    updateHunter() {
        let deliveryboyX = this.deliveryboy.x;
        let deliveryboyY = this.deliveryboy.y;

        for (const m of this.collider.children.entries) {
            if (this.activeHunter) {
                const distance = Phaser.Math.Distance.Between(
                    deliveryboyX, deliveryboyY,
                    this.activeHunter.body.position.x, this.activeHunter.body.position.y
                )
                if (distance > 800) {
                    this.control = false;
                    this.activeHunter = undefined;
                }
            }  
            const distance = Phaser.Math.Distance.Between(
                deliveryboyX, deliveryboyY,
                m.body.position.x, m.body.position.y
            )
            if (distance < 600 && this.hb) {
                this.hb.visible = true;
                let size = m.getData('health') / 500;
                this.hb!.setScale(size, 0.2);
                this.shooting(m);
                this.hitHunter(m);
                if(m.body.position.x > this.deliveryboy.body.position.x){
                    m.body.gameObject.flipX = true;
                }else{
                    m.body.gameObject.flipX = false;
                }
                for (const hb of this.hbgroup.children.entries) {
                    hb.body.position.x = m.body.position.x
                    hb.body.position.y = m.body.position.y - 20
                }
            }
        }
    }
    //lövés
    shooting(m: Phaser.GameObjects.GameObject | any) {
        //lövedék
        let shoot = this.scene.physics.add.group({
            frameQuantity: 1,
            active: false,
            visible: false,
            allowDrag: false,
            key: "gunshot"
        });
        this.scene.physics.add.collider(this.deliveryboy, shoot, this.hitPlayer, undefined, this)
        const st = shoot.getFirstDead(false);
        if (this.scene.time.now > this.nextFire) {
            this.nextFire = this.scene.time.now + 2000;
            m.anims.play("hunter_shoot", true);
            if (st) {
                st.body.reset(m.body.position.x, m.body.position.y);
                st.setActive(true);
                st.setVisible(true);
                this.scene.physics.moveTo(st, this.deliveryboy.x, this.deliveryboy.y, 900)
            }
        }
    }
    //player lövés
    hitHunter(hunter: Phaser.GameObjects.GameObject | undefined) {
        if (!hunter) return;
        this.size = hunter!.getData('health') / 500; //0,16
        if (!this.control) {
            this.activeHunter = hunter;
            this.activeHunter!.setInteractive().on('pointerup', () => {
                //shared.emit('shoot', this.activeHunter);
                this.game.playercontroller?.playerGunShot(this.activeHunter);
                this.counter = 0;
            })
            this.control = true;
        }
    }
    hitHunterHandeler(damage: number){
        if(this.counter == 0){
            this.activeHunter?.body.gameObject.anims.play("hunter_hurt")
            this.activeHunter!.setData('health', this.activeHunter!.getData('health') - damage)
            this.hb!.setScale(this.size, 0.2)
            this.size -= 0.04;
            if (this.activeHunter!.getData('health') <= 0) {
                this.activeHunter!.destroy();
                this.hb!.setScale(0, 0)
                //this.game.ui.setTp(1);
                this.game.playercontroller?.setTp(1);
                this.activeHunter = undefined;
                this.control = false;
                }
            }
        this.counter++;
    }

}