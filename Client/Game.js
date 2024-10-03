import {
    GAME_WIDTH, GAME_HEIGHT,
    GROUND_SPEED,
    OBJECT_TYPE_CACTUS, OBJECT_TYPE_FIRE, OBJECT_TYPE_PLAYER, OBJECT_TYPE_POKET_BALL,
    JOB_TYPE_CREATE_OBJECT_FIRE
} from "./Constant.js";

import Player from "./Player.js";
import Fire from "./Fire.js";
import Item from "./Item.js";
import Cactus from "./Cactus.js";

import ItemController from "./ItemController.js";
import CactiController from "./CactiController.js";

import Ground from "./Ground.js";
import Score from "./Score.js";

class Game {
    constructor() {
        this.jobQue = [];
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");

        // 관리중인 오브젝트 목록
        this.objects = [];
    }

    static GetInstance() {
        if (this.gInstance === undefined) {
            this.gInstance = new Game();
        }

        return this.gInstance;
    }

    GameStart() {
        // 선인장        
        this.CACTI_CONFIG = [
            { width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png' },
            { width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png' },
            { width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png' }
        ];

        // 아이템
        this.ITEM_CONFIG = [
            { width: 50 / 1.5, height: 50 / 1.5, id: 1, image: 'images/items/pokeball_red.png' },
            { width: 50 / 1.5, height: 50 / 1.5, id: 2, image: 'images/items/pokeball_yellow.png' },
            { width: 50 / 1.5, height: 50 / 1.5, id: 3, image: 'images/items/pokeball_purple.png' },
            { width: 50 / 1.5, height: 50 / 1.5, id: 4, image: 'images/items/pokeball_cyan.png' }
        ];

        // 이미지 비율
        this.scaleRatio = null;

        const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
        const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

        // window is wider than the game width
        if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
            this.scaleRatio = screenWidth / GAME_WIDTH;
        } else {
            this.scaleRatio = screenHeight / GAME_HEIGHT;
        }

        // 화면 설정
        this.SetScreen();

        // 스프라이트 가져오기
        this.CreateSprites();

        // 아이템 관리자 생성
        this.itemController = new ItemController(this.ctx, this.cactiImages, this.scaleRatio, GROUND_SPEED);
        // 선인장 관리자 생성
        this.cactiController = new CactiController(this.ctx, this.cactiImages, this.scaleRatio, GROUND_SPEED);

        // 점수판
        this.score = new Score(this.ctx, this.scaleRatio);

        // ground 생성
        this.ground = new Ground(this.ctx, this.scaleRatio);

        // 플레이어 생성
        this.player = new Player(this.ctx, this.scaleRatio);

        // 점수
        this.score = new Score(this.ctx, this.scaleRatio);

        this.objects.push(this.ground);
        this.objects.push(this.player);
        this.objects.push(this.score);
    }

    SetScreen() {
        // 화면 설정
        this.canvas.width = GAME_WIDTH * this.scaleRatio;
        this.canvas.height = GAME_HEIGHT * this.scaleRatio;
    }

    CreateSprites() {
        this.cactiImages = this.CACTI_CONFIG.map((cactus) => {
            const image = new Image();
            image.src = cactus.image;
            return {
                image,
                width: cactus.width * this.scaleRatio,
                height: cactus.height * this.scaleRatio,
            };
        });

        this.itemImages = this.ITEM_CONFIG.map((item) => {
            const image = new Image();
            image.src = item.image;
            return {
                image,
                id: item.id,
                width: item.width * this.scaleRatio,
                height: item.height * this.scaleRatio,
            };
        });
    }

    GetObjects() {
        return this.objects;
    }

    // 오브젝트 생성
    CreateObject(objectType) {

        let object = null;

        switch (objectType) {
            case OBJECT_TYPE_PLAYER:
                object = new Player(this.ctx, this.scaleRatio);
                break;
            case OBJECT_TYPE_FIRE:
                object = new Fire(this.ctx, this.scaleRatio);
                break;
            default:
                break;
        }

        if (object !== null) {
            this.objects.push(object);

            return object;
        }
    }

    UpdateObject(gameSpeed, deltaTime) {
        if (this.jobQue.length > 0) {
            const newJob = this.jobQue.shift();

            switch (newJob.jobType) {
                case JOB_TYPE_CREATE_OBJECT_FIRE:
                    const OBJECT_TYPE = newJob.job.shift();
                    const spawnXPosition = newJob.job.shift();
                    const spawnYPosition = newJob.job.shift();
                    const FireObject = this.CreateObject(OBJECT_TYPE);

                    FireObject.SetPosition(spawnXPosition, spawnYPosition);
                    break;
            }
        }

        if (this.objects.length > 0) {
            this.objects.forEach((object) => object.update(gameSpeed, deltaTime));
        }
    }

    DrawObject() {
        if (this.objects.length > 0) {
            this.objects.forEach((object) => object.draw());
        }
    }

    ObjectResest() {
        this.ground.reset();
        this.score.reset();
        this.cactiController.reset();
    }
}

export default Game;