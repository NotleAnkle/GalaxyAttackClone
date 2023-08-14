import { PoolType } from "./SimplePool";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PoolMember extends cc.Component {
    @property({ type: cc.Enum(PoolType) })
    public poolType: PoolType = PoolType.None;

    public OnInit(){
        
    }
}
