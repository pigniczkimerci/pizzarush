import Phaser, { Tilemaps } from 'phaser';
import Game from '../scenes/Game';
import Physics from './Physicss';

type PotionType = 'health' | 'jump' | 'avocado' | 'bread';
interface Potion {
    name: string;
    sprite: string;
    type: PotionType;
}
const potionMap: Record<string, Potion> = {
    'potion_health': { name: 'potion_health', sprite: 'potionhealth', type: 'health' },
    'potion_jump': { name: 'potion_jump', sprite: 'potionjump', type: 'jump' },
    'avocado': {name: 'avocado', sprite: 'avocado', type: 'avocado'},
    'bread': {name: 'bread', sprite: 'bread', type: 'bread'}
  };
export default class PotionController extends Physics{
    private group: Phaser.Physics.Arcade.Group;
    constructor(game: Game, scene: Phaser.Scene, ground: Phaser.Tilemaps.TilemapLayer, deliveryboy: Phaser.Physics.Arcade.Sprite) {
        super(game, scene,ground,deliveryboy);
        this.group = this.scene.physics.add.group({
            immovable: true
        });
        //sprite hozzáadása
        //@ts-ignore
        const potionObjects = this.scene.map.getObjectLayer('potion').objects;
        const potionSprites = potionObjects.map((potion: { name: string | number; x: number; y: number; }) => {
            const { sprite, type } = potionMap[potion.name];
            const spriteObj = this.scene.physics.add.sprite(potion.x, potion.y, sprite);
            spriteObj.setData('potion', type);
            return spriteObj;
          });
          this.group.addMultiple(potionSprites);
        //ütközés megvalósítása
        this.scene.physics.add.collider(this.group, this.ground);
        this.scene.physics.add.collider(this.group, this.deliveryboy, this.handlePlayerPotionCollide, undefined, this);
    }
    //ütközés a játékos és a potion között
    handlePlayerPotionCollide(deliveryboy: any, potion: { getData: (arg0: string) => any; destroy: () => void; }){
        const data = potion.getData("potion") as PotionType;
        switch(data) {
            case 'health':
              //this.game.ui.setHealth(5);
              this.game.playercontroller?.setHealth(5);
              break;
            case 'jump':
              this.game.playercontroller?.setJumpHeight(60);
              break;
            case 'avocado':
              this.game.playercontroller?.setStrong(10);
              break;
            case 'bread':
              this.game.playercontroller?.setStrong(20);
              break;
        }
        potion.destroy();
    }
    
}