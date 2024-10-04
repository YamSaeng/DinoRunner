import { C2S_PACKET_TYPE_MOVE_STAGE, C2S_PACKET_TYPE_SCORE_UPDATE, C2S_SCORE_SEND_TIME } from "./Constant.js";
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
  }

  update(deltaTime) {        
    if (this.start == true) {
      this.score += deltaTime * 0.001 * this.scoreMultiple;

      if (Math.floor(this.score) === this.goalScore && this.stageChange) {        
        this.stageChange = false;
        Session.GetInstance().SendEvent(C2S_PACKET_TYPE_MOVE_STAGE, { currentStage: 1000, targetStage: 1001 });
      }

      if (this.serverScoreUpdateTime < 0) {
        this.serverScoreUpdateTime = C2S_SCORE_SEND_TIME;

        Session.GetInstance().SendEvent(C2S_PACKET_TYPE_SCORE_UPDATE, { score: Math.floor(this.score) });
      }

      this.serverScoreUpdateTime -= deltaTime;
    }    
  }

  SetScoreInfo(goalScore, scoreMultiple) {
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

  SetScoreMinus(score)
  {
    this.score -= score;
    if(this.score < 0)
    {
      this.score = 0;
    }
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 25 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(scorePadded, scoreX, y);
  }
}

export default Score;
