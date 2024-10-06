import Fire from "./Fire.js";

class FireController {
    constructor(ctx, scaleRatio, itemController) {
        this.fireId = 1; // 관리중인 fire 구분하기 위한 id 값
        this.fires = [];
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.itemController = itemController;
    }

    CreateFire(spawnXPosition, spawnYPosition) {
        const newFire = new Fire(this.fireId, this.ctx, this.scaleRatio);
        newFire.SetPosition(spawnXPosition, spawnYPosition);

        this.fires.push(newFire);
        this.fireId++;
    }

    Update(gameSpeed, deltaTime) {       
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

    CollideWithMultiple(sprites) {
        let isCollider = false;

        for (let i = 0; i < this.fires.length; i++) {
            for (let j = 0; j < sprites.length; j++) {
                if (this.fires[i].collideWith(sprites[j])) {
                    sprites[j].isCollide = true;
                    this.fires[i].isCollide = true;
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