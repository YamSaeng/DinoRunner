import { FIRE_SPEED, FIRE_ANIMATION_TIME, FIRE_ANIMATION_START_SPRITE_INDEX } from "./Constant.js"

class Fire {
    sprites = [];

    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.scaleRatio = scaleRatio;
        this.width = 100 * this.scaleRatio;
        this.height = 50 * this.scaleRatio;
        this.x = 0;
        this.y = 0;
        this.speed = FIRE_SPEED;

        this.animationTime = FIRE_ANIMATION_TIME;
        this.animationIndex = FIRE_ANIMATION_START_SPRITE_INDEX;

        this.SpriteLoad();
    }

    SpriteLoad() {
        for (let i = 1; i <= 8; i++) {
            let FireSprite = new Image();
            FireSprite.src = `images/fire/Fire${i}.png`;
            this.sprites.push(FireSprite);
        }

        this.image = this.sprites[0];
    }

    Animation(gameSpeed, deltaTime) {
        if (this.animationTime < 0) {
            this.animationTime = FIRE_ANIMATION_TIME;
            this.image = this.sprites[this.animationIndex];

            this.animationIndex++;

            if (this.animationIndex >= this.sprites.length) {
                this.animationIndex = FIRE_ANIMATION_START_SPRITE_INDEX;
            }
        }

        this.animationTime -= deltaTime;
    }

    SetPosition(xPosition, yPosition) {
        this.x = xPosition;
        this.y = yPosition;
    }

    update(gameSpeed, deltaTime) {
        this.x += gameSpeed * deltaTime * this.speed;

        this.Animation(gameSpeed, deltaTime);
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default Fire;