// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CacheComponent from "./CacheComponent";
import PoolMember from "./Pool/PoolMember";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends PoolMember {

    @property
    private speed: number = 2000;
    private damage: number = 4;

    public onInit(damage: number){
        this.damage = damage;
    }

    update (dt) {
        const velocity = this.node.up.mul(dt).mul(this.speed);
        const newPos = this.node.position.add(velocity);

        this.node.setPosition(newPos);

        if(this.node.position.y >= 950) {
            SimplePool.despawn(this);
        }
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        CacheComponent.getCharacter(other).onHit(this.damage);
        SimplePool.spawn(PoolType.VFX_Spark, this.node.getWorldPosition());
        SimplePool.despawn(this);
    }
}
