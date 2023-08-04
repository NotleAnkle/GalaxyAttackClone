// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import SimplePool, { PoolType } from "./Pool/SimplePool";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ship extends cc.Component {

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
    

    private touchOffset: cc.Vec2;

    // gioi han khu vuc dieu khien
    private screen: cc.Vec2 = new cc.Vec2(cc.view.getVisibleSize().width,cc.view.getVisibleSize().height);
    private clampHorizon: cc.Vec2;
    private clampVertical: cc.Vec2;

    private isShooting: boolean =  false;

    // LIFE-CYCLE CALLBACKS:

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

    shoot(){
        this.bulletPoints.forEach(point => {
            (SimplePool.spawn(PoolType.Bullet_1,  point.getWorldPosition(),point.angle) as Bullet).onInit(10);
        })
    }

    onStart(){
        if(!this.isShooting){
            this.isShooting = true;
        }
    }
}
