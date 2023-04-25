import Phaser, { Tilemaps } from 'phaser'
import Game from '../scenes/Game';

export default class PlayerController{
    private _sprite: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private cursorsWASD: any;
    private canDoubleTouch = 0;
    public _health: number;
    public _tp: number;
    private game: Game;
    private _nextFire = 0;
    private _alertShown = 0;
    private _maxDamage = 20;
    private _maxJumpHeight = 380;
    private _gunshot = "potato";
    private _jumpStick = false;
    private _playerMoveAnimation = false;
    private _playerHurtAnimation = false;
    private _damageBool = false;
    private _jumpBool = false;
    private _craft = false;
    private _rightStick = false;
    private _leftStick = false;
    constructor(game:Game, scene: Phaser.Scene, sprite: Phaser.Physics.Arcade.Sprite, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.scene = scene;
        this.sprite = sprite.setDepth(10);
        this.cursors = cursors;
        this.cursorsWASD = this.scene.input.keyboard.addKeys({ up: Phaser.Input.Keyboard.KeyCodes.W, crafting: Phaser.Input.Keyboard.KeyCodes.C, left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D });
        this._health = 100;
        this._tp = 0;
        this.sprite.body.enable = true;
        this.game = game;
    }
     //lövés
     playerGunShot(enemy: any | Phaser.GameObjects.GameObject | Phaser.GameObjects.Group | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group[]) {
            //lövedék
            let shoot = this.scene.physics.add.group({
                frameQuantity: 1,
                active: false,
                visible: false,
                allowGravity: false,
                key: this.gunshot
            });
            this.scene.physics.add.collider(enemy, shoot, this.hitEnemy, undefined, this)
            const st = shoot.getFirstDead(false);
            if (this.scene.time.now > this.nextFire) {
                this.nextFire = this.scene.time.now + 500;
                if (st) {
                    st.body.reset(this.sprite.x, this.sprite.y);
                    st.setActive(true);
                    st.setVisible(true);
                    this.scene.physics.moveTo(st, enemy.body.position.x, enemy.body.position.y, 800)
                }
            }
    }
    setHealth(value: number){
        if (value < 0) {
            this.health += value;
            this.playerHurtAnimation = true;
        }else{
            let miss = 100 - this.health;
            if(miss > value){
                this.health += value;
            }else{
                this.health += miss;
            }
        }
        this.game.ui.setHealth(value);
    }
    setTp(value: number){
        this.tp += value;
        this.game.ui.setTp(value);
    }
    //támadás
    hitEnemy(enemy: any, shoot: { destroy: () => void; }) {
        this.sprite.play("player-walk", false);
        if (shoot) {
            shoot.destroy();
            this.game.huntercontroller?.hitHunterHandeler(this.maxDamage)
            this.damageBool = false;
        }
    }
    //mozgás
    playerMove(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!cursors) {
            return;
        }
        console.log(this.health);
        const speed = 200
        const jump = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        const jump2 = Phaser.Input.Keyboard.JustDown(this.cursorsWASD.up)
        if (this.cursors.left.isDown || this.cursorsWASD.left.isDown || this.leftStick) {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
            this.playerMoveAnimation = true;
        } else if (this.cursors.right.isDown || this.cursorsWASD.right.isDown || this.rightStick) {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed);
            this.playerMoveAnimation = true;
        } else {
            this.sprite.setVelocityX(0);
            this.playerMoveAnimation = false;
        }
        //jump megvalósítás
        if ((jump || jump2) && this.canDoubleTouch < 1) {
            this.sprite.setVelocityY(-this.maxJumpHeight);
            this.canDoubleTouch++;
            this.jumpBool = false;
        } if (this.sprite.body.blocked.down) {
            this.canDoubleTouch = 0;
        }
        //mozgás stickek segítségével
            //jump megvaslósítás 
            if (this.game.ui.moveStick() == "top") {
                if (this.scene.time.now > this.nextFire) {
                    this.nextFire = this.scene.time.now + 500;
                    if(this.canDoubleTouch < 2 && !this.jumpStick){
                        this.sprite.setVelocityY(-(this.maxJumpHeight+100));
                        this.canDoubleTouch++;
                        this.jumpStick = true;
                    }
                    this.jumpStick = false;
                }
            }
            if (this.game.ui.moveStick() == "right") {
                this.rightStick = true;
            }
            if (this.game.ui.moveStick() == "left") {
                this.leftStick = true;
            }
            if(this.game.ui.moveStick() == "none"){

                this.rightStick = false;
                this.leftStick = false;
            }
    }
    
    //pizza craftolás
    crafting() {
        if(this.game.ui.moveStick() == "craft"){
            this.craft = true;
        }
        else{
            this.craft = false;
        }
        
        if (this.cursorsWASD.crafting.isDown || this.craft) {
            return true;
        }
        return false;
    }
    playerAnimation() {
        if (this.playerHurtAnimation) {
            // playerMoveAnimation = false
            this.sprite.play("player_hurt", true);
            this.scene.time.addEvent({
                delay: 200,
                callback: () => {
                    this.playerHurtAnimation = false;
                },
                loop: false
            })
            //
        }
        if (this.playerMoveAnimation && !this.playerHurtAnimation) {
            this.sprite.play("player-walk", true);
        }
    }
    //ugrás potion
    setJumpHeight(value: number){
        if (!this.jumpBool) {
            this.maxJumpHeight = this.maxJumpHeight + value;
            this.jumpBool = true;
        }
    }
    setStrong(value: number){
        if (value == 10) {
            this.gunshot = "avocado"
        }
        if (value == 20) {
            this.gunshot = "bread"
        }
        if (!this.damageBool) {
            this.maxDamage += value;
            this.damageBool = true;
        }
    }
    tutorial() {
        //TUTORIAL
        if (location.href.split("/").pop() === "intro.html") {
            if (this.sprite.body.position.y == 900 && this.sprite.body.position.x > 200 && this.alertShown === 0) {
                window.alert("irányításd a játékost a nyilak vagy a wasd billentyűk segítségével")
                this.alertShown++;
            }
            if (this.sprite.body.position.x > 280 && this.alertShown === 1) {
                window.alert("a képernyő bal sarkában találhatóak(balról jobbra):\nzöld csík: élet\nkék csík: tapasztalati pont\nitemek száma\npizzák száma")
                this.alertShown++;
            }
            if (this.sprite.body.position.x > 370 && this.alertShown === 2) {
                window.alert("szuper!\nvigyázz az ananász életet vesz el tőled")
                this.alertShown++;
            }
            if(this.sprite.body.position.x > 808 && this.alertShown === 3){
                window.alert("vigyázz az ninja támad!!\nvégezz vele!!\nközelre támadni a bal egérgombbal tudsz\ncsak ököllel tudod támadni, ha hozzáérsz")
                this.alertShown++;
            }
            if(this.sprite.body.position.x > 1200 && this.alertShown === 4){
                window.alert("nézd meg mi van a ládában!!")
                this.alertShown++;
            }
            if(this.sprite.body.position.x > 1330 && this.alertShown === 5){
                window.alert("vigyázz a mama lop!\nmenekülj!")
                this.alertShown++;
            }
            if(this.sprite.body.position.x > 1700 && this.alertShown === 6){
                window.alert("ha esetleg kevés életed maradt, lehetőséges van a piros potion megivására, mely plusz életet biztosít a számodra")
                this.alertShown++;
            }
            if(this.sprite.body.position.x > 1900 && this.alertShown === 7){
                window.alert("a vadásznak fegyvere van\nmesszire támadni a bal egérgombbal tudsz")
                this.alertShown++;
            }
            if(this.sprite.body.position.x > 2780 && this.alertShown === 8){
                window.alert("az ajtó kinyitásához 1db pizzára van szükséged\npizzát 3db itemből tudsz készíteni a C betűvel")
                this.alertShown++;
            }
        }
    }
    //GETTER SETTER
    public get health() {
        return this._health;
    }
    public set health(value: number) {
       // if (this.health > 1) {
            this._health = value;
       // }

    }
    public get sprite(): Phaser.Physics.Arcade.Sprite {
        return this._sprite;
    }
    public set sprite(value: Phaser.Physics.Arcade.Sprite) {
        this._sprite = value;
    }
    public get tp() {
        return this._tp;
    }
    public set tp(value: number) {
        this._tp = value;
    }
    public get leftStick() {
        return this._leftStick;
    }
    public set leftStick(value) {
        this._leftStick = value;
    }
    public get rightStick() {
        return this._rightStick;
    }
    public set rightStick(value) {
        this._rightStick = value;
    }
    public get craft() {
        return this._craft;
    }
    public set craft(value) {
        this._craft = value;
    }
    public get jumpBool() {
        return this._jumpBool;
    }
    public set jumpBool(value) {
        this._jumpBool = value;
    }
    public get damageBool() {
        return this._damageBool;
    }
    public set damageBool(value) {
        this._damageBool = value;
    }
    public get playerHurtAnimation() {
        return this._playerHurtAnimation;
    }
    public set playerHurtAnimation(value) {
        this._playerHurtAnimation = value;
    }
    public get playerMoveAnimation() {
        return this._playerMoveAnimation;
    }
    public set playerMoveAnimation(value) {
        this._playerMoveAnimation = value;
    }
    public get jumpStick() {
        return this._jumpStick;
    }
    public set jumpStick(value) {
        this._jumpStick = value;
    }
    public get gunshot() {
        return this._gunshot;
    }
    public set gunshot(value) {
        this._gunshot = value;
    }
    public get maxJumpHeight() {
        return this._maxJumpHeight;
    }
    public set maxJumpHeight(value) {
        this._maxJumpHeight = value;
    }
    public get maxDamage() {
        return this._maxDamage;
    }
    public set maxDamage(value) {
        this._maxDamage = value;
    }

    public get alertShown() {
        return this._alertShown;
    }
    public set alertShown(value) {
        this._alertShown = value;
    }
    public get nextFire() {
        return this._nextFire;
    }
    public set nextFire(value) {
        this._nextFire = value;
    }
}
