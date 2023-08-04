import PoolMember from "./Pool/PoolMember";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Character extends PoolMember {
    private hp : number;

    get isDead(): boolean {
        return this.hp <= 0;
    }

    public onInit(hp: number){
        this.hp = hp;
    }

    public onHit(damage: number){     
        if(!this.isDead){
            this.hp -= damage;
            if(this.isDead){
                this.onDeath();
            }
        }
    }

    protected onDeath(){
        
    }
}