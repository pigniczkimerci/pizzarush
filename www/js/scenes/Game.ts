import Phaser, { GameObjects } from 'phaser'
import PlayerController from '../characters/PlayerController'

import {animations} from "../config/Animation"
import DoorController from '../physics/Door';
import ChestController from '../physics/Chest';
import ObstacleController from '../physics/Obstacle';
import AnanasController from '../physics/Ananas';
import GrannyController from '../characters/Granny';
import NinjaController from '../characters/Ninja';
import HunterController from '../characters/Hunter';
import PotionController from '../physics/Potion';
import Enemy from '../characters/Enemy';
import UI from '../ui/UI';

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private deliveryboy: Phaser.Physics.Arcade.Sprite | undefined = this.playercontroller?.sprite;
  private bgtile!: Phaser.GameObjects.TileSprite;
  private bghouse!: Phaser.GameObjects.TileSprite;
  
  public ui: UI;
  public level: number = 1;
  
  private pizza = 0;
  

  public playercontroller?: PlayerController;
  private doorcontroller?: DoorController;
  private chestcontroller?: ChestController;
  private obstacleconroller?: ObstacleController;
  private ananasconroller?: AnanasController;
  private grannycontroller?: GrannyController;
  private ninjacontroller?: NinjaController;
  public huntercontroller?: HunterController;
  private potioncontroller?: PotionController;

  //map
  private ground!: Phaser.Tilemaps.TilemapLayer;
  public map!: Phaser.Tilemaps.Tilemap;
  private collidesforenemy!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super('game')
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  preload() {
    this.load.image("deliveryboy", "img/deliveryboy2.png")
    this.load.image("deliveryboy_walk", "img/deliveryboy_walk.png")
    this.load.image("deliveryboy_hurt", "img/deliveryboy2_hurt.png")
    this.load.atlas("deliveryboy_hurt", "img/deliveryboy2_hurt.png")
    //tiles
    this.load.image("tiles", "img/500.png")
    this.load.tilemapTiledJSON("tilemap", "img/tilemap.json")
    this.load.tilemapTiledJSON("tileintro", "img/intro2.json")
    //background
    this.load.image('bg', "img/bg.jpg");
    this.load.image('bg2', "img/bg_h.png");
    //door
    this.load.image("door", "img/door2.png")
    //board
    this.load.image("board_1", "img/board_1.png")
    this.load.image("board_2", "img/board_2.png")
    this.load.image("board_3", "img/board_3.png")
    this.load.image("board_4", "img/board_4.png")
    this.load.image("board_5", "img/board_5.png")
    this.load.image("board_6", "img/board_6.png")
    this.load.image("board_7", "img/board_7.png")
    this.load.image("board_8", "img/board_8.png")
    this.load.image("board_9", "img/board_9.png")
    this.load.image("board_10", "img/board_10.png")
    //chest
    this.load.image("chest", "img/chest.png")
    this.load.image("chest_opened", "img/chest_opened.png")
    //obstacle
    this.load.image("obstacle", "img/obstacle.png")
    //ananas
    this.load.image("ananas", "img/ananas.png")
    //potato
    this.load.image("potato", "img/Potato.png")
    this.load.image("bread", "img/Bread.png")
    this.load.image("avocado", "img/Avocado.png")
    //pizzafeltétek
    this.load.image("bacon", "img/bacon.png")
    this.load.image("cheese", "img/cheese.png")
    this.load.image("tomato", "img/Tomato.png")
    this.load.image("sausages", "img/Sausages.png")
    //potion
    this.load.image("potionhealth", "img/potion_health.png")
    this.load.image("potionjump", "img/potion_jump.png")
    this.load.image("potionstrong", "img/potion_strong.png")
    //enemies
    this.load.image("collider", "img/collider.png")
    this.load.image("granny", "img/granny.png")
    this.load.image("granny_walk", "img/granny_walk.png")
    this.load.image("ninja", "img/ninja.png")
    this.load.image("ninja_walk", "img/ninja_walk.png")
    this.load.image("hunter", "img/hunter.png")
    this.load.image("hunter_shoot", "img/hunter_shoot.png")
    this.load.image("hunter_hurt", "img/hunter_hurt.png")
    this.load.image("gunshot", "img/gunshot.png")

  }

  create() {
    //Map
    let tileset;
    if(location.href.split("/").pop() === "game.html"){
      this.map = this.make.tilemap({ key: 'tilemap' })
      tileset = this.map.addTilesetImage("500", "tiles")
    }
    if(location.href.split("/").pop() === "intro.html"){
      this.map = this.make.tilemap({ key: 'tileintro' })
      tileset = this.map.addTilesetImage("500", "tiles")
    }
    this.ui = this.scene.get('ui') as UI;
    //Hátter
    this.bgtile = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg');
    this.bgtile.setOrigin(0, 0);
    this.bgtile.setScrollFactor(0);
    this.bghouse = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "bg2");
    this.bghouse.setOrigin(0, 0);
    this.bghouse.setScrollFactor(0);
    
    if(tileset){
      this.ground = this.map.createLayer("ground", tileset);
      this.ground.setCollisionByProperty({ collides: true });
    }

    this.spawn();

    this.physics.add.collider(this.deliveryboy!, this.ground).name = "deliverynground"
    
    //ui
    this.scene.launch('ui')

    animations(this.anims);
  }
  
  update() {
    if (!this.deliveryboy) return;
    //death
    if(this.playercontroller?.health! <= 0){
      //Sessionstorage a scoreboardhoz
      sessionStorage.setItem("gameover", this.playercontroller?.tp.toString()!);
      //shared.emit("gameover", this.playercontroller?.tp);
      //új oldal megnyitása
      window.location.replace("scoreboard.html");
      this.game.destroy(true,false);
    } 
    //Háttér kép mozgás
    this.bgtile.tilePositionX -= this.cameras.main.scrollX * 0.0003;
    //Mozgatás
    this.playercontroller?.playerMove(this.cursors);
    
    //Chest
    this.chestcontroller?.updateActiveChest()
    this.chestcontroller?.deleteItem();
    //Ajtók nyitása
    this.doorcontroller?.updateDoor();
    if (this.doorcontroller?.updateActiveDoor() && this.doorcontroller?.itemneed! <= this.pizza) {
      //a chestekhez
      this.level++;
      //ajtók kinyitása
      this.doorcontroller?.updateItemsDoor();
      //pizza levonása
      this.pizza = this.pizza - this.doorcontroller?.itemneed!;
      //ajtók itemszükségletének növelése
      this.doorcontroller.itemneed++;

      //ui
      //this.ui.setTp(2);
      this.playercontroller?.setTp(2);
      this.ui.craftPizza(this.pizza);
     // shared.emit('level', this.level);
    }
    this.doorcontroller?.updateActiveDoor()

    //ANANSZ
   // this.ananasconroller?.updateHealth()

    //Háttérkép mozgása
    this.bgMove();

    //ENEMIES
   this.grannycontroller?.updateActiveGranny();
    //granny
    if (this.grannycontroller?.updateColliderGranny()) {
      this.chestcontroller?.removeItem(this.chestcontroller.items - 1);
    }
    //ninja
    this.ninjacontroller?.updateHealth();
    //hunter
    this.huntercontroller?.updateHunter();

    //CRAFTING
    if(this.playercontroller?.crafting() && this.chestcontroller?.items){
      if(this.chestcontroller?.items! >= 3){
        let items = Math.floor(this.chestcontroller?.items / 3)
        this.pizza += items;
        this.chestcontroller?.removeItem(this.chestcontroller?.items - items*3)
        /*shared.emit('setItem', this.chestcontroller?.getItems)
        shared.emit('craftPizza', this.pizza)*/
        this.ui.setItem(this.chestcontroller?.items);
        this.ui.craftPizza(this.pizza);
      }
    }

    //ANIMATIONS
    this.playercontroller?.playerAnimation();

    
    //TUTORIAL
    this.playercontroller?.tutorial();
  }

  //háttérkép
  bgMove() {
    if (this.deliveryboy!.body.velocity.x < 0 && (!this.deliveryboy!.body.blocked.left)) {
     // this.bghouse.tilePositionX -= this.cameras.main.scrollX * 0.001;
     this.bghouse.tilePositionX -= 1;
    } else if (this.deliveryboy!.body.velocity.x > 0 && (!this.deliveryboy!.body.blocked.right)) {
     // this.bghouse.tilePositionX += this.cameras.main.scrollX * 0.001;
     this.bghouse.tilePositionX += 1;
    }
    this.bghouse.tilePositionY = this.cameras.main.scrollY + 100;

  }
  spawn() {
    //objectslayer a spawnoláshoz
    const objectsLayer = this.map.getObjectLayer("objects")
    //potion group
    objectsLayer.objects.forEach(objData => {
      const { x = 0, y = 0, name } = objData
      switch (name) {
        case "spawn": {
          //kirajzoljuk
          this.deliveryboy = this.physics.add.sprite(x, y, 'deliveryboy').setRotation()
          //playercontrollerhez hozzáadjuk
          this.playercontroller = new PlayerController(this,this,this.deliveryboy, this.cursors);
          //camera
          this.cameras.main.setBounds(0, 0, 24000, 2900, true).startFollow(this.deliveryboy);
          break;
        }
      }
    })
    //objektumok
    //this.enemyController = new Enemy(this, this, this.ground, this.character, this.deliveryboy, 100, 2)
    this.doorcontroller = new DoorController(this,this, this.ground, this.deliveryboy!);
    this.chestcontroller = new ChestController(this, this, this.ground, this.deliveryboy!);
    this.obstacleconroller = new ObstacleController(this, this, this.ground, this.deliveryboy!);
    this.ananasconroller = new AnanasController(this, this, this.ground, this.deliveryboy!);
    this.grannycontroller = new GrannyController(this,this, this.ground, this.deliveryboy!);
    this.ninjacontroller = new NinjaController(this,this, this.ground, this.deliveryboy!);
    this.huntercontroller = new HunterController(this,this, this.ground, this.deliveryboy!);
    this.potioncontroller = new PotionController(this, this, this.ground, this.deliveryboy!);
  }
}
