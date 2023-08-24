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

    public getHp(){
        return this.hp;
    }

    public onHit(damage: number){     
        if(!this.isDead){
            this.hp -= damage;
            if(this.isDead){
                this.onDeath();
            }
        }
    }

    protected onHitEffect(object, color){
        object.color = color; // Đặt màu trắng
        this.scheduleOnce(() => {
            object.color = cc.color(255, 255, 255); // Quay trở lại màu sắc ban đầu
        }, 0.1);
        if(object.children){
            const children = object.children;
            for(const child of children){
                this.onHitEffect(child, color);
            }
        }
    }

    protected onDeath(){
        
    }
}