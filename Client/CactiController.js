import Cactus from "./Cactus.js";

class CactiController {

    CACTUS_INTERVAL_MIN = 500;
    CACTUS_INTERVAL_MAX = 2000;

    nextCactusInterval = null;
    cactis = [];

    constructor(ctx, cactiImages, scaleRatio, speed) {
        this.cactusID = 1; // 관리중인 선인장 구분하기 위한 ID값
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.cactiImages = cactiImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextCactusTime();
    }

    setNextCactusTime() {
        this.nextCactusInterval = this.getRandomNumber(
            this.CACTUS_INTERVAL_MIN,
            this.CACTUS_INTERVAL_MAX
        );
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createCactus() {
        const index = this.getRandomNumber(0, this.cactiImages.length - 1);
        const cactusImage = this.cactiImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - cactusImage.height;        

        const cactus = new Cactus(
            this.cactusID,
            this.ctx,
            x,
            y,
            cactusImage.width,
            cactusImage.height,
            cactusImage.image
        );                     

        this.cactis.push(cactus);
        this.cactusID++;
    }


    update(gameSpeed, deltaTime) {
        if(this.nextCactusInterval <= 0) {
            // 선인장 생성
            this.createCactus();
            this.setNextCactusTime();
        }

        this.nextCactusInterval -= deltaTime;

        // 충돌한 선인장이 있으면 해당 선인장을 제거
        this.cactis.forEach((cactus)=>{
            if(cactus.isCollide == true)
            {
                this.cactis = this.cactis.filter(collideCactus => collideCactus.id !== cactus.id);
            }
        })

        this.cactis.forEach((cactus) => {
            cactus.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        // 지나간 선인장 삭제
        this.cactis = this.cactis.filter(cactus => cactus.x > -cactus.width);
    }

    draw() {
        this.cactis.forEach((cactus) => cactus.draw());
    }

    collideWithSingle(sprite) {
        let isCollider = false;

        this.cactis.forEach(cactus => {
            if(cactus.collideWith(sprite))
            {                
                cactus.isCollide = true;                
                isCollider = true;
            }
        });        

        return isCollider;
    }

    reset() {
        this.cactis = [];
    }
}

export default CactiController;