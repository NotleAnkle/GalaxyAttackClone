// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    //singleton
    private static ins: UIManager;
    public static get Ins() : UIManager
    {
        return UIManager.ins;
    }

    protected onLoad(): void {
        UIManager.ins = this;

        for(let i = 0; i < this.prefabs.length; i++){
            this.roots[i] = new cc.Node();
            this.roots[i].setParent(this.node);
        }

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    //--------------------------------

    @property([cc.Prefab])
    prefabs: cc.Node[] = [];

    roots: cc.Node[] = [];

    canvas: cc.Node[] = [];

    public onOpen(index: number ){
        if(this.canvas[index] == null) {
            this.canvas[index] = cc.instantiate(this.prefabs[index]);
            this.canvas[index].setParent(this.roots[index]);
        }

        this.canvas[index].active = true;
    }

    //close theo index
    public onClose(index: number){
        if(this.canvas[index] != null){
            this.canvas[index].active = false;
        }
    }

    public closeAll(){
        for(let i = 0; i < this.canvas.length; i++) this.onClose(i);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.escape) {
            if (cc.game.isPaused()) {
                this.onClose(3);
                cc.game.resume();
            } else {
                this.onOpen(3);
                setTimeout(() => {
                    cc.game.pause();
                }, 50);
                
            }
        }
    }
    

}
