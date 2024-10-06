import {
    MAIN_GAME_CANVAS_WIDTH, MAIN_GAME_CANVAS_HEIGHT,
    RANK_SCORE_CANVAS_WIDTH, RANK_SCORE_CANVAS_HEIGHT,
    GROUND_SPEED, CACTUS_MINUS_SCORE,
    OBJECT_TYPE_FIRE, OBJECT_TYPE_PLAYER, ITEM_PLUS_SCORE,
    JOB_TYPE_CREATE_OBJECT_FIRE
} from "./Constant.js";

import Player from "./Player.js";
import Fire from "./Fire.js";

import ItemController from "./ItemController.js";
import CactiController from "./CactiController.js";
import FireController from "./FireController.js";

import Ground from "./Ground.js";
import Score from "./Score.js";

class Game {
    constructor() {
        this.jobQue = [];
        this.rankings = [];
        this.mainCanvas = document.getElementById("game");
        this.mainCtx = this.mainCanvas.getContext("2d");
        this.scoreCanvas = document.getElementById("score");
        this.scoreCtx = this.scoreCanvas.getContext("2d");
        this.userID = 0;

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
        if (screenWidth / screenHeight < MAIN_GAME_CANVAS_WIDTH / MAIN_GAME_CANVAS_HEIGHT) {
            this.scaleRatio = screenWidth / MAIN_GAME_CANVAS_WIDTH;
        } else {
            this.scaleRatio = screenHeight / MAIN_GAME_CANVAS_HEIGHT;
        }

        // 화면 설정
        this.SetScreen();

        // 스프라이트 가져오기
        this.CreateSprites();

        // 아이템 관리자 생성
        this.itemController = new ItemController(this.mainCtx, this.itemImages, this.scaleRatio, GROUND_SPEED);
        // 선인장 관리자 생성
        this.cactiController = new CactiController(this.mainCtx, this.cactiImages, this.scaleRatio, GROUND_SPEED);
        // 불꽃 관리자 생성
        this.fireController = new FireController(this.mainCtx, this.scaleRatio, this.itemController);

        // 점수판
        this.score = new Score(this.mainCtx, this.scaleRatio);

        // ground 생성
        this.ground = new Ground(this.mainCtx, this.scaleRatio);

        // 플레이어 생성
        this.player = new Player(this.mainCtx, this.scaleRatio);

        // 점수
        this.score = new Score(this.mainCtx, this.scaleRatio);

        this.objects.push(this.ground);
        this.objects.push(this.player);
        this.objects.push(this.score);
    }

    SetScreen() {
        // 화면 설정
        this.mainCanvas.width = MAIN_GAME_CANVAS_WIDTH * this.scaleRatio;
        this.mainCanvas.height = MAIN_GAME_CANVAS_HEIGHT * this.scaleRatio;

        this.scoreCanvas.width = RANK_SCORE_CANVAS_WIDTH * this.scaleRatio;
        this.scoreCanvas.height = RANK_SCORE_CANVAS_HEIGHT * this.scaleRatio;
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
                object = new Player(this.mainCtx, this.scaleRatio);
                break;
            case OBJECT_TYPE_FIRE:
                object = new Fire(this.mainCtx, this.scaleRatio);
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

                    this.fireController.CreateFire(spawnXPosition, spawnYPosition);
                    break;
            }
        }

        if (this.objects.length > 0) {
            this.objects.forEach((object) => object.update(gameSpeed, deltaTime));
        }        

        this.fireController.CollideWithMultiple(this.cactiController.cactis);        
        this.fireController.Update(gameSpeed, deltaTime);

        if (this.cactiController.collideWithSingle(this.player)) {            
            //this.score.SetScoreMinus(CACTUS_MINUS_SCORE);            
        }

        this.cactiController.update(gameSpeed, deltaTime); 

        if(this.itemController.collideWith(this.player)){
            //this.score.SetScorePlus(ITEM_PLUS_SCORE);
        }

        this.itemController.update(gameSpeed, deltaTime);

        this.score.update(deltaTime);
    }

    DrawObject() {
        if (this.objects.length > 0) {
            this.objects.forEach((object) => object.draw());
        }

        this.cactiController.draw();
        this.fireController.Draw();
        this.itemController.draw();

        this.DrawRankingScore();
    }

    SetGameInit(data) {                  
        this.userID = data.uuid;             
        this.score.SetScoreInfo(data.currentStage.currentStageId, data.currentStage.nextStageId, data.currentStage.goalScore, data.currentStage.scoreMultiple);
    }

    SetStageUpdate(data) {             
        this.score.SetScoreInfo(data.currentStageId, data.nextStageId, data.goalScore, data.scoreMultiple);

        this.score.stageChange = true;
    }

    SetRankScores(rankDatas) {
        this.rankings = [];

        for (let i = 0; i < rankDatas.length; i++) {
            if(rankDatas[i][0].userUUID === this.userID)
            {
                this.score.score = rankDatas[i][0].score;                
            }

            this.rankings.push({
                userID: rankDatas[i][0].userUUID,
                score: rankDatas[i][0].score,
                currentStage: rankDatas[i][0].currentStage
            });            
        }
    }

    SetRankScore(rankData) {       
        this.rankings.forEach(rank => {
            if (rank.userID == rankData.userUUID) {
                rank.score = rankData.score;
                rank.currentStage = rankData.currentStage;
            }
        });
    }

    OtherUserDisconnect(data) {
        this.rankings = this.rankings.filter(ranking => ranking.userID !== data);
    }

    DrawRankingScore() {
        const y = 25 * this.scaleRatio;
        const fontSize = 20 * this.scaleRatio;

        this.scoreCtx.font = `${fontSize}px serif`;
        this.scoreCtx.fillStyle = '#525250';

        const scoreX = 10 * this.scaleRatio;

        let scorePadded = "점수판 ";

        this.scoreCtx.fillText(scorePadded, scoreX, y);

        this.scoreCtx.fillText("----------------------------", scoreX, y + 20);

        let rankYPosition = y + 40;
        if (this.rankings.length > 0) {
            this.rankings.forEach(rank => {
                const userID = rank.userID;
                const score = rank.score;
                const currentStage = rank.currentStage;

                const rankText = `ID : ${userID} 점수 : ${score}    스테이지 : ${currentStage}`;
                this.scoreCtx.fillText(rankText, scoreX, rankYPosition);
                rankYPosition += 20;
            });
        }
    }

    ObjectResest() {
        this.ground.reset();
        this.score.reset();
        this.cactiController.reset();
    }
}

export default Game;