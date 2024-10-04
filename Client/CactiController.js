import Cactus from "./Cactus.js";

class CactiController {

    CACTUS_INTERVAL_MIN = 500;
    CACTUS_INTERVAL_MAX = 2000;

    nextCactusInterval = null;
    cactis = [];


    constructor(ctx, cactiImages, scaleRatio, speed) {
        this.cactusID = 1;
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

        this.cactis.forEach((cactus) => {
            cactus.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        // 지나간 선인장 삭제
        this.cactis = this.cactis.filter(cactus => cactus.x > -cactus.width);
    }

    draw() {
        this.cactis.forEach((cactus) => cactus.draw());
    }

    collideWith(sprite) {
        let isCollider = false;

        this.cactis.forEach(cactus => {
            if(cactus.collideWith(sprite))
            {                
                this.cactis = this.cactis.filter(collideCactus => cactus.id !== collideCactus.id);                
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