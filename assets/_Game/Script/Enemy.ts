// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import CacheComponent from "./CacheComponent";
import Character from "./Character";
import levelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends Character {

    @property({
        type: [cc.Node],
        tooltip: 'bulletPoints'
    })
    public bulletPoints: cc.Node[] = [];

    private isShooting: boolean = false;

    public onHit(damage: number): void {
        this.onHitEffect(this.node, cc.color(120, 0, 120));
        
        super.onHit(damage);
    }

    OnInit(){
        this.isShooting = false;
    }

    onStart(){
        this.isShooting = true;
    }

    protected onDeath() {
        SimplePool.despawn(this);
        SimplePool.spawn(PoolType.VFX_Explore, this.node.getWorldPosition(), 0);
        levelManager.Ins.onEnemyDeath(this);
        SoundManager.Ins.PlayClip(AudioType.FX_EnemyDie);
    }

    public moveTo(target: cc.Vec3, duration: number, isWorldSpace: boolean) {
        const targetPostion = isWorldSpace ? this.node.getLocalPosition(target) : target;

        cc.tween(this.node)
            .to(duration, 
                {position: targetPostion},
                { easing: "linear"}
                )
            .start();
    }

    private cooldown: number = (1 + Math.random() * (2 - 1 + 1));
    private timer: number = this.cooldown;
    update (dt) {
        if(this.isShooting){            
            if(this.timer <= 0){
                this.timer += this.cooldown;
                for (let i = 0; i < this.bulletPoints.length; i++){
                    (SimplePool.spawn(PoolType.Bullet_2,  this.bulletPoints[i].getWorldPosition(),this.bulletPoints[i].angle) as Bullet).onInit(10, -1);
                }
            }

            this.timer -= dt;
        }
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if (other.node.group === "player") {
            CacheComponent.getCharacter(other).onHit(10);
            SoundManager.Ins.PlayClip(AudioType.FX_EnemyDie);
        }
    }
}
