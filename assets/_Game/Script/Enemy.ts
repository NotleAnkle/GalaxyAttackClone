// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Character from "./Character";
import levelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends Character {

    public onHit(damage: number): void {
        super.onHit(damage);
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
}
