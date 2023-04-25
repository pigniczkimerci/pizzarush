import Phaser from 'phaser'
export default class UI extends Phaser.Scene{
    private itemText!: Phaser.GameObjects.Text;
    private pizzaText!: Phaser.GameObjects.Text;
    private hb!: Phaser.GameObjects.Sprite;
    private tp!: Phaser.GameObjects.Sprite;
    private scalenumberY = 0.4;
    private _scalenumberX = 0.4;
    private _itemcontrol = 0;
    private _pizzacontrol = 0;

    private bot: Phaser.GameObjects.Rectangle;
    private top: Phaser.GameObjects.Rectangle;
    private left: Phaser.GameObjects.Rectangle;
    private right: Phaser.GameObjects.Rectangle;
    private craft: Phaser.GameObjects.Rectangle;
    private drirection: string = "";
    private width:number = window.innerWidth;

    public get pizzacontrol() {
        return this._pizzacontrol;
    }
    public set pizzacontrol(value) {
        this._pizzacontrol = value;
    }
    public get itemcontrol() {
        return this._itemcontrol;
    }
    public set itemcontrol(value:number) {
        this._itemcontrol = value;
    }
    public get scalenumberX() {
        return this._scalenumberX;
    }
    public set scalenumberX(value) {
        this._scalenumberX = value;
    }
    private scalenumberYtp = 0.4;
    private _scalenumberXtp = 0.01;
    public get scalenumberXtp() {
        return this._scalenumberXtp;
    }
    public set scalenumberXtp(value) {
        this._scalenumberXtp = value;
    }
    private group!: Phaser.GameObjects.Group;

    constructor()
	{
		super({key: 'ui', active: true})
	}
    preload(){
        //healthbar && tpbar
        this.load.image("healthbar", "img/healthbar.png")
        this.load.image("healthbarcontainer", "img/healthbarcontainer.png")
        this.load.image("tpbar", "img/tpbar.png")
        this.load.image("tpcontainer", "img/tpcontainer.png")
        this.load.image("pizza", "img/pizza.png")
        this.load.image("cheese", "cheese/pizza.png")

        this.load.image("cross", "img/cross.png")
    }
    create(){
       // const width = this.scale.width;
       
        if(this.width > 1000){
            this.width = this.width /2;
        }
        // Calculate scale factor based on screen width
        const scaleFactor = this.width / 1000;

        // healthbar
        let hbcontainer = this.add.sprite(30 * scaleFactor, 30 * scaleFactor, "healthbarcontainer").setScale(0.4 * scaleFactor).setOrigin(0, 0.5).setScrollFactor(0, 0);
        this.hb = this.add.sprite(hbcontainer.x + 11 * scaleFactor, hbcontainer.y - 2 * scaleFactor, 'healthbar')
            .setOrigin(0, 0.5).setScrollFactor(0, 0)

        // tpbar
        let tpcontainer = this.add.sprite(290 * scaleFactor, 30 * scaleFactor, "tpcontainer").setScale(0.4 * scaleFactor).setOrigin(0, 0.5).setScrollFactor(0, 0);
        this.tp = this.add.sprite(tpcontainer.x + 11 * scaleFactor, tpcontainer.y - 2 * scaleFactor, 'tpbar')
            .setOrigin(0, 0.5).setScrollFactor(0, 0)

        // set scale
        this.tp.setScale(scaleFactor/100, scaleFactor/2.8);
        this.hb.setScale(scaleFactor/2.5, scaleFactor/2.8);

        // Itemek mennyisége
        this.itemText = this.add.text(590 * (this.width / 1000), 28 * (this.width / 1000), this.itemcontrol.toString(), { fontFamily: 'Font', fontSize: "20px" }).setOrigin(0, 0.5).setScrollFactor(0, 0);
        this.add.sprite(550 * scaleFactor, 28 * scaleFactor, "cheese")

        // Pizzák menniysége
        this.pizzaText = this.add.text(710 * scaleFactor, 28 * scaleFactor, this.pizzacontrol.toString(), { fontFamily: 'Font', fontSize: "20px" }).setOrigin(0, 0.5).setScrollFactor(0, 0);
        this.add.sprite(670 * scaleFactor, 28 * scaleFactor, "pizza").setScale(0.8);

        this.bot = this.add.rectangle(this.scale.width, this.scale.height, 40, 30, 0x000000).setOrigin(2, 1).setInteractive();
        this.top = this.add.rectangle(this.scale.width, this.scale.height, 40, 30, 0x000000).setOrigin(2, 3).setInteractive();
        this.left = this.add.rectangle(this.scale.width, this.scale.height, 40, 30, 0x000000).setOrigin(3, 2).setInteractive();
        this.right = this.add.rectangle(this.scale.width, this.scale.height, 40, 30, 0x000000).setOrigin(1, 2).setInteractive();

        this.craft = this.add.rectangle(this.scale.width, this.scale.height, 40, 30, 0x000000).setOrigin(5, 1.5).setInteractive();
    }
    setTp(value: number){
        const scaleFactor = this.width / 1000;
        this.scalenumberXtp += 0.004;
        this.tp.setScale(scaleFactor*this.scalenumberXtp, scaleFactor*this.scalenumberYtp)
    }
    setItem(items: number){
        if(items == -1)  this.itemcontrol += items;
        else this.itemcontrol = items;
        this.itemText.setText(this.itemcontrol.toString())
    }
    setHealth(value:number){
        const scaleFactor = this.width / 1000;
        let n = 0.004 * value;
        this.scalenumberX += n;
        this.hb.setScale(scaleFactor*this.scalenumberX, scaleFactor*this.scalenumberY);
    }
    craftPizza(pizzas: number){
        this._pizzacontrol = pizzas;
        this.pizzaText.setText(this.pizzacontrol.toString())
    }
    update(time: number, delta: number): void {
        this.top.on('pointerdown', () => {this.drirection = "top";});
        this.top.on('pointerup', () => {this.drirection = "noneStick"; });
        this.left.on('pointerdown', () => {this.drirection = "left"; });
        this.right.on('pointerdown', () => {this.drirection = "right";});
        this.craft.on('pointerdown', () => {this.drirection = "craft";});
        this.left.on('pointerup', () => {this.drirection = "none"; });
        this.right.on('pointerup', () => {this.drirection = "none";});
        this.craft.on('pointerup', () => {this.drirection = "none";});
    }

    moveStick(){
        return this.drirection;
    }
}

