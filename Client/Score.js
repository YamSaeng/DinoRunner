import { C2S_PACKET_TYPE_MOVE_STAGE, C2S_SCORE_SEND_TIME } from "./Constant.js";
import Session from "./Network/Session.js";

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.serverScoreUpdateTime = C2S_SCORE_SEND_TIME;
    this.scoreMultiple = 0;
    this.goalScore = 0;
    this.start = false;

    this.currentStage = 0;
    this.nextStage = 0;
    this.second = 0;
    this.score = 0;
  }

  update(deltaTime) {
    if (this.start == true) {

      if (Math.floor(this.score) >= this.goalScore && this.stageChange) {
        this.stageChange = false;
        Session.GetInstance().SendEvent(C2S_PACKET_TYPE_MOVE_STAGE, { score: this.score, currentStage: this.currentStage, nextStage: this.nextStage });
      }

      if (this.serverScoreUpdateTime < 0 && this.stageChange == true) {
        this.score += this.scoreMultiple;        

        this.serverScoreUpdateTime = C2S_SCORE_SEND_TIME;
      }

      if (this.stageChange == true) {
        this.serverScoreUpdateTime -= deltaTime;
      }
    }
  }

  SetScoreInfo(currentStage, nextStage, goalScore, scoreMultiple) {
    this.currentStage = currentStage;
    this.nextStage = nextStage;
    this.goalScore = goalScore;
    this.scoreMultiple = scoreMultiple;

    this.start = true;
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  SetScoreMinus(score) {
    this.score -= score;
    if (this.score < 0) {
      this.score = 0;
    }
  }

  SetScorePlus(score) {
    this.score += score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 25 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 155 * this.scaleRatio;
    const highScoreX = scoreX - 200 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(`최고 점수 : ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`점수 : ${scorePadded}`, scoreX, y);
  }
}

export default Score;
