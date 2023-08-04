import Character from "./Character";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CacheComponent {

    private static linkCharacter: Map<cc.Collider, Character> = new Map<cc.Collider, Character>;

    public static getCharacter(col: cc.Collider): Character{
        if(!this.linkCharacter.has(col)){
            this.linkCharacter.set(col, col.getComponent(Character));
        }
        return this.linkCharacter.get(col);
    }
    
}