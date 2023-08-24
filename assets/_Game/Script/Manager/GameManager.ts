// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum GameState{
    Menu = 0,
    Playing = 1,
    Pause = 2,
    End = 3
}

@ccclass
export default class GameManager extends cc.Component {

    //singleton
    private static ins: GameManager;
    public static get Ins(): GameManager {
        return GameManager.ins;
    }
    protected onLoad(): void {
        GameManager.ins = this;
    }

    private state: GameState;

    public getState(){
        return this.state;
    }
    
    public changeState(state: GameState){
        this.state = state;
    }

    public isState(state : GameState){
        return (state === this.state);
    }
    
}
