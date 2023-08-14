// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Character from "./Character";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Shield extends Character {

    protected onLoad(): void {
        this.onInit(100);
    }

    protected onDeath(): void {
        this.node.active = false;
        this.onInit(100);
    }

    
}
