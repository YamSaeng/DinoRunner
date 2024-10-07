import Fire from "./Fire.js";

// 불꽃 관리
class FireController {
    constructor(ctx, scaleRatio, itemController) {
        this.fireId = 1; // 관리중인 fire 구분하기 위한 id 값
        this.fires = [];
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.itemController = itemController;
    }

    // 불꽃 생성
    CreateFire(spawnXPosition, spawnYPosition) {
        const newFire = new Fire(this.fireId, this.ctx, this.scaleRatio);
        newFire.SetPosition(spawnXPosition, spawnYPosition);

        this.fires.push(newFire);
        this.fireId++;
    }

    // 불꽃 업데이트
    Update(gameSpeed, deltaTime) {       
        // 충돌한 불꽃이 있으면 제거
        this.fires.forEach((fire)=>{
            if(fire.isCollide == true)
            {
                this.fires = this.fires.filter(collideFire => collideFire.id !== fire.id);
            }
        })

        this.fires.forEach((fire) => {
            fire.update(gameSpeed, deltaTime);
        });
        
        this.fires = this.fires.filter(fire => fire.x < 800);
    }

    // 매개변수로 받은 sprites 배열과 충돌하는지 확인
    CollideWithMultiple(sprites) {
        let isCollider = false;

        for (let i = 0; i < this.fires.length; i++) {
            for (let j = 0; j < sprites.length; j++) {
                // 충돌 여부 확인 하고 기록
                if (this.fires[i].collideWith(sprites[j])) {
                    sprites[j].isCollide = true;
                    this.fires[i].isCollide = true;

                    // 부딪힌 대상 위치에 아이템 생성
                    this.itemController.createItem(sprites[j].x);

                    break;
                }
            }
        }

        return isCollider;
    }

    Draw() {
        this.fires.forEach((fire) => fire.draw());
    }
}

export default FireController;