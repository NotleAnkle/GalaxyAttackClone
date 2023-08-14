// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import Character from "./Character";
import levelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import UIManager from "./Manager/UIManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ship extends Character {

    @property({
        type: [cc.Node],
        tooltip: 'bulletPoint_1'
    })
    public bulletPoints_1: cc.Node[] = [];

    @property({
        type: [cc.Node],
        tooltip: 'bulletPoint_2'
    })
    public bulletPoints_2: cc.Node[] = [];

    private bulletPoints: cc.Node[] = [];

    @property(cc.Node)
    private ripple: cc.Node = null;

    @property(cc.Node)
    private shield: cc.Node = null;
    
    @property(cc.Node)
    private flame: cc.Node = null;

    private touchOffset: cc.Vec2;

    // gioi han khu vuc dieu khien
    private screen: cc.Vec2 = new cc.Vec2(cc.view.getVisibleSize().width,cc.view.getVisibleSize().height);
    private clampHorizon: cc.Vec2;
    private clampVertical: cc.Vec2;

    private isShooting: boolean =  false;


    OnInit(){
        this.node.active = true;
        this.bulletPoints = this.bulletPoints_1;
        this.isShooting = false;
        this.flame.active = true;
        this.shield.active = false;
        this.ripple.active = false;
        this.node.x = 0;
        this.node.y = -1800;
    }

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);

        this.screen = new cc.Vec2(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
        this.clampHorizon = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);
        this.clampVertical = new cc.Vec2(-0.5, 0.5).mul(this.screen.y);

        this.bulletPoints = this.bulletPoints_1;
    }

    //Move

    //Nhan xuong
    private onTouchBegan(event: cc.Event.EventTouch){
        this.onStart();
        this.touchOffset = Utilities.vec3ToVec2(this.node.position).subtract(this.getMousePoint(event));
    }

    //di chuot
    private onTouchMoved(event: cc.Event.EventTouch) {
        const newPos = this.getMousePoint(event);

        newPos.x = cc.misc.clampf(newPos.x, this.clampHorizon.x, this.clampHorizon.y);
        newPos.y = cc.misc.clampf(newPos.y, this.clampVertical.x, this.clampVertical.y);

        this.node.position = Utilities.vec2ToVec3(newPos);
    }

    private getMousePoint(event: cc.Event.EventTouch): cc.Vec2{
        return event.getLocation().sub(cc.v2(this.screen.x * 0.5, this.screen.y * 0.5));
    }

    private timer: number = 0;
    update (dt) {
        if(this.isShooting){
            if(this.timer <= 0){
                this.timer += 0.2;
                this.shoot();
            }

            this.timer -= dt;
        }
    }

    private shoot(){
        SoundManager.Ins.PlayClip(AudioType.FX_Bullet);
        for (let i = 0; i < this.bulletPoints.length; i++) {
          (SimplePool.spawn(PoolType.Bullet_1,  this.bulletPoints[i].getWorldPosition(),this.bulletPoints[i].angle) as Bullet).onInit(10, 1);
        }
      }

    public onPowerUp(): void {
        this.bulletPoints = this.bulletPoints_2;
        this.shield.active = true;
        SoundManager.Ins.PlayClip(AudioType.FX_Booster);
    }

    public onAwake() {  
        this.onInit(40);
        this.moveTo(cc.Vec3.UP.mul(-500), 1 , 
        ()=> {
            //bật tut
            //bật fx
            this.ripple.active = true;
            UIManager.Ins.onOpen(0);
            this.flame.active = false;
        } ,
        false);        
    }

    public onStart(): void{
        if (!this.isShooting) {
            this.isShooting = true;
            //tắt tut
            //tắt fx
            this.ripple.active = false;
            UIManager.Ins.onClose(0);
          }
        levelManager.Ins.onStart();
    }

    public onFinish(): void {
        this.isShooting = false;
        this.moveTo(this.node.position.add(cc.Vec3.UP.mul(-200)), 1 ,
        ()=> {
            this.flame.active = true;
            this.moveTo(this.node.position.add(cc.Vec3.UP.mul(10000)), 2 ,
            ()=> UIManager.Ins.onOpen(1) 
        ,false)
        } 
        ,false);
    
      }
    
      public moveTo(target: cc.Vec3, duration: number, doneAction: Function, isWorldSpace: boolean): void {
        // Lấy vị trí target position của node
        const targetPosition = isWorldSpace ? this.node.getLocalPosition(target) : target;
    
        // Tạo một tween để di chuyển node từ vị trí hiện tại đến vị trí mới (position)
        cc.tween(this.node)
          .to(duration,
            { position: targetPosition },
            { easing: "linear", }
          )
          .call(doneAction)
          .start();
      }

    protected onDeath() {
        this.node.active = false;
        SimplePool.spawn(PoolType.VFX_Explore, this.node.getWorldPosition(), 0);
        SoundManager.Ins.PlayClip(AudioType.FX_EnemyDie);
        UIManager.Ins.onOpen(2);
    }
}
