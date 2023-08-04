// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Utilities extends cc.Component {

    //chuyen vector 3 sang vector 2
    public static vec3ToVec2(v: cc.Vec3): cc.Vec2{
        return cc.v2(v.x, v.y)
    }

    //chuyen vector 2 sang vector 3
    public static vec2ToVec3(v: cc.Vec2): cc.Vec3{
        return cc.v3(v.x, v.y, 0);
    }
}
