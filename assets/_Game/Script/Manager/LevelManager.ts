// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Character from "../Character";
import Enemy from "../Enemy";
import SimplePool, { PoolType } from "../Pool/SimplePool";
import Ship from "../Ship";
import UIManager from "./UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class levelManager extends cc.Component {

    //singleton
    private static ins : levelManager;
    public static get Ins(): levelManager 
    {
        return levelManager.ins;
    }
    protected onLoad(): void {
        levelManager.ins = this;
    }
    //--------------------------

    @property(Ship)
    public ship : Ship = null;

    @property(cc.Node)
    public stage_1: cc.Node[] = [];

    @property(cc.Node)
    public stage_2: cc.Node[] = [];

    @property(cc.Node)
    public stage_3: cc.Node = null;

    private list: Enemy[] = [];
    private isBooster: boolean;
    private stage: number = 0;

    //

    public OnInit(): void{
      this.ship.OnInit();
      this.list.splice(0, this.list.length);
      this.stage = 0;
      this.start();
    }


    public OnLoadLevel(level : number): void{
      
    }

    
    public OnReset(): void{
      //đưu tất cả oject về pool và đặt lại giá trị thuộc tính
      SimplePool.collectAll();
      //tat UI
      UIManager.Ins.closeAll();
      //khởi động lại level
      this.OnInit();
    }

    //

    protected start(): void {
        this.onLoadStage_1();
        this.isBooster = false;
        
        this.ship.onAwake();
    }

    public onStart(){
      for(const e of this.list) e.onStart();
    }
   
    public onLoadStage_1(): void {
        this.stage_1.forEach(stage => {
            let e = SimplePool.spawnT<Enemy>(PoolType.Enemy_1, stage.getWorldPosition().add(cc.Vec3.UP.mul(1000)), 0);
            e.moveTo(stage.getWorldPosition(),1, true);
            this.list.push(e);
            e.onInit(40);
        } )
    }

    public onLoadStage_2(): void {
        //bay từ 2 bên sang
        for (let i = 0; i < 6; i++) {
           let e = SimplePool.spawnT<Enemy>(PoolType.Enemy_2, this.node.getWorldPosition().add(new cc.Vec3(-1000,0,0)), 0);
           e.moveTo(this.stage_2[i].getWorldPosition(), 0.5, true);
           this.list.push(e);
           e.onInit(40);
           e.onStart();
        }
  
        for (let i = 6; i < this.stage_2.length; i++) {
           let e = SimplePool.spawnT<Enemy>(PoolType.Enemy_2, this.node.getWorldPosition().add(new cc.Vec3(1000,0,0)), 0);
           e.moveTo(this.stage_2[i].getWorldPosition(), 0.5, true);
           this.list.push(e);
           e.onInit(40);
           e.onStart();
        }
     }

     public onLoadStage_3() {
         let e = SimplePool.spawnT<Enemy>(PoolType.Boss, this.stage_3.getWorldPosition().add(cc.Vec3.UP.mul(1000)), 0);
         e.moveTo(this.stage_3.getWorldPosition(), 1, true);
         this.list.push(e);
         e.onInit(4000);
         e.onStart();
     }

     onFinish() {
        this.ship.onFinish();
     }

    public onEnemyDeath(c: Enemy): void{
        let index = this.list.indexOf(c);
        if (index != -1) {
           this.list.splice(index, 1);
        }
        
        if(this.list.length == 0){
           this.stage++;
           switch(this.stage){
              case 0:
                 this.onLoadStage_1();
                 break;
              case 1:
                 this.onLoadStage_2();
                 break;
               case 2:
               this.onLoadStage_3();
               break;
              default:
                 this.onFinish();
                 break;
           }
        }
  
        if(!this.isBooster){
           this.isBooster = true;
           SimplePool.spawn(PoolType.Booster, c.node.getWorldPosition());
        }
     }
}
