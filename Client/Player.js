import {
    PLAYER_SPEED, PLAYER_JUMP_SPEED, FIRE_COUNT, FIRE_ATTACK_TIMER,
    PLAYER_WIDTH, PLAYER_HEIGHT,
    OBJECT_TYPE_PLAYER,
    MIN_JUMP_HEIGHT, MAX_JUMP_HEIGHT,
    GRAVITY, WINDOW_LEFT, WINDOW_RIGHT,
    JOB_TYPE_CREATE_OBJECT_FIRE, OBJECT_TYPE_FIRE
} from "./Constant.js";
import Game from "./Game.js"
import Job from "./Job.js"

class Player {
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    dinoRunImages = [];

    // 점프 상태값
    jumpPressed = false;
    jumpInProgress = false;
    falling = false;

    JUMP_SPEED = PLAYER_JUMP_SPEED;
    GRAVITY = GRAVITY;

    // 생성자
    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.minJumpHeight = MIN_JUMP_HEIGHT * this.scaleRatio;
        this.maxJumpHeight = MAX_JUMP_HEIGHT * this.scaleRatio;
        this.width = PLAYER_WIDTH * this.scaleRatio;
        this.height = PLAYER_HEIGHT * this.scaleRatio;

        this.objectType = OBJECT_TYPE_PLAYER;
        this.x = 10 * this.scaleRatio;
        this.y = this.canvas.height - this.height - 1.5 * this.scaleRatio;
        this.speed = 0;

        this.fireAttackTimer = 0;
        this.fireCount = FIRE_COUNT;

        // 기본 위치 상수화
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = "images/standing_still.png";
        this.image = this.standingStillImage;

        // 달리기
        const dinoRunImage1 = new Image();
        dinoRunImage1.src = "images/dino_run1.png";

        const dinoRunImage2 = new Image();
        dinoRunImage2.src = "images/dino_run2.png";

        this.dinoRunImages.push(dinoRunImage1);
        this.dinoRunImages.push(dinoRunImage2);

        // 키보드 설정
        // 등록된 이벤트가 있는 경우 삭제하고 다시 등록
        window.removeEventListener("keydown", this.keydown);
        window.removeEventListener("keyup", this.keyup);

        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);
    }

    keydown = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = true;
        }

        if (event.code === "ArrowLeft") {
            this.speed = -PLAYER_SPEED;
        }

        if (event.code === "ArrowRight") {
            this.speed = PLAYER_SPEED;
        }

        if (event.code === "KeyA") {
            if (this.fireAttackTimer <= 0 && this.fireCount > 0) {
                let game = Game.GetInstance();
                if (game != null) {
                    this.fireCount--;
                    game.jobQue.push(new Job(JOB_TYPE_CREATE_OBJECT_FIRE,
                        OBJECT_TYPE_FIRE, this.x, this.y));

                    this.fireAttackTimer = FIRE_ATTACK_TIMER;
                }
            }
        }

        if (event.code === "KeyR") {
            this.fireCount = FIRE_COUNT;
        }
    };

    keyup = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = false;
        }

        if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
            this.speed = 0;
        }
    };

    update(gameSpeed, deltaTime) {
        this.move(gameSpeed, deltaTime);
        this.animation(gameSpeed, deltaTime);

        if (this.jumpInProgress) {
            this.image = this.standingStillImage;
        }

        this.jump(deltaTime);

        this.fireAttackTimer -= deltaTime;
    }

    move(gameSpeed, deltaTime) {
        if (this.x < WINDOW_LEFT) {
            this.x = WINDOW_LEFT;
            return;
        }

        if (this.x > WINDOW_RIGHT) {
            this.x = WINDOW_RIGHT;
            return;
        }

        this.x += gameSpeed * deltaTime * this.speed;
    }

    jump(deltaTime) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        // 점프가 진행중이고 떨어지는중이 아닐때
        if (this.jumpInProgress && !this.falling) {
            // 현재 인스턴스의 위치가 점프의 최소, 최대값의 사이일때
            if ((this.y > this.canvas.height - this.minJumpHeight) ||
                (this.y > this.canvas.height - this.maxJumpHeight) && this.jumpPressed) {
                // 아무튼 위의 내용은 버튼을 눌렀을때 올라가는 조건
                this.y -= this.JUMP_SPEED * deltaTime * this.scaleRatio;
            } else {
                this.falling = true;
            }
            // 떨어질 때
        } else {
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * deltaTime * this.scaleRatio;

                // 혹시 위치가 어긋 났을때 원래 위치로
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition
                }
            } else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }

    animation(gameSpeed, deltaTime) {
        if (this.walkAnimationTimer <= 0) {
            if (this.image === this.dinoRunImages[0]) {
                this.image = this.dinoRunImages[1];
            } else {
                this.image = this.dinoRunImages[0];
            }

            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }

        this.walkAnimationTimer -= deltaTime * gameSpeed;
    }

    draw() {
        const fireCountTextX = 10 * this.scaleRatio;
        const fireCountTextY = 25 * this.scaleRatio;

        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = '#525250';

        this.ctx.fillText(`불꽃 남은 개수 ${this.fireCount}  [R] : 재장전`, fireCountTextX, fireCountTextY);
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default Player;