// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import levelManager from "./Manager/LevelManager";
import PoolMember from "./Pool/PoolMember";
import SimplePool from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PowerUp extends PoolMember {

    private speed: number = 500;
    private time: number = 0;
    private threshold: number = 20;

    protected onEnable(): void {
        this.time = 1;
    }

    protected update(dt: number): void {
        if(this.time > 0) {
            const direction = cc.v2(0, -1).rotateSelf(this.node.angle * Math.PI / 180);

            const velocity = direction.mul(this.speed);
            const delta = velocity.mul(cc.director.getDeltaTime());
            const v3Delta = new cc.Vec3(delta.x, delta.y, 0);
            const newPos =  this.node.position.add(v3Delta);

            this.node.setPosition(newPos);
            
            this.time -= dt;
        }
        else{
            const playerPos = levelManager.Ins.ship.node.position;

            //get info this boost
            const boostPos = this.node.position;

            // calculate distance btw this boost with player
            const distance = playerPos.sub(boostPos).mag();
            const direction = playerPos.sub(boostPos).normalize();

            // movement action
            const movement = direction.mul(2000 * dt);

            // move this boost towards player node
            this.node.position = boostPos.add(movement);

            // checking if distance btw this boost with player = 0, it will despawn self
            if (distance < this.threshold) {
                this.onDespawn();
            }
        }
    }

    onDespawn() {
        levelManager.Ins.ship.onPowerUp();
        SimplePool.despawn(this);
    }
}
