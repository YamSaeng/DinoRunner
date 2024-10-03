import { GROUND_WIDTH, GROUND_HEIGHT, GROUND_SPEED } from "./Constant.js";

class Ground {
    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.width = GROUND_WIDTH * this.scaleRatio;
        this.height = GROUND_HEIGHT * this.scaleRatio;
        this.speed = GROUND_SPEED;        

        this.x = 0;
        this.y = this.canvas.height - this.height;

        this.groundImage = new Image();
        this.groundImage.src = "images/ground.png";
    }

    update(gameSpeed, deltaTime) {
        this.x -= gameSpeed * deltaTime * this.speed * this.scaleRatio;
    }

    draw() {
        this.ctx.drawImage(
            this.groundImage,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.ctx.drawImage(
            this.groundImage,
            // 2개 연결
            this.x + this.width,
            this.y,
            this.width,
            this.height
        );

        // 땅이 끝났을 때 처음으로
        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    reset() {
        this.x = 0;
    }
}

export default Ground;