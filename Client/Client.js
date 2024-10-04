import { GAME_SPEED_START, GAME_SPEED_INCREMENT, C2S_PACKET_TYPE_GAME_INIT, C2S_PACKET_TYPE_GAME_START } from "./Constant.js"
import Game from "./Game.js";
import Session from "./Network/Session.js";

Game.GetInstance().GameStart();
Session.GetInstance().Connect();

// 게임 요소들
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

window.addEventListener('resize', Game.GetInstance().SetScreen);

if (screen.orientation) {
  screen.orientation.addEventListener('change', Game.GetInstance().SetScreen);
}

function showGameOver() {
  const fontSize = 70 * Game.GetInstance().scaleRatio;
  Game.GetInstance().mainCtx.font = `${fontSize}px Verdana`;
  Game.GetInstance().mainCtx.fillStyle = 'grey';
  const x = Game.GetInstance().mainCanvas.width / 4.5;
  const y = Game.GetInstance().mainCanvas.height / 2;
  Game.GetInstance().mainCtx.fillText('GAME OVER', x, y);
}

function showStartGameText() {
  const fontSize = 40 * Game.GetInstance().scaleRatio;
  Game.GetInstance().mainCtx.font = `${fontSize}px Verdana`;
  Game.GetInstance().mainCtx.fillStyle = 'grey';
  const x = Game.GetInstance().mainCanvas.width / 14;
  const y = Game.GetInstance().mainCanvas.height / 2;  
  Game.GetInstance().mainCtx.fillText('Tap Screen or Press Space To Start', x, y);
}

function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false;

  Game.GetInstance().ObjectResest();  

  Session.GetInstance().SendEvent(C2S_PACKET_TYPE_GAME_INIT, { timestamp: Date.now() });
  Session.GetInstance().SendEvent(C2S_PACKET_TYPE_GAME_START);

  gameSpeed = GAME_SPEED_START;
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true });
    }, 1000);
  }
}

function clearScreen() {
  Game.GetInstance().mainCtx.fillStyle = 'white';
  Game.GetInstance().mainCtx.fillRect(0, 0, Game.GetInstance().mainCanvas.width, Game.GetInstance().mainCanvas.height);
  Game.GetInstance().scoreCtx.fillStyle = 'white';
  Game.GetInstance().scoreCtx.fillRect(0, 0, Game.GetInstance().scoreCanvas.width, Game.GetInstance().scoreCanvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  // 프레임 렌더링 속도
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();  

  // 게임 안에 있는 오브젝트 업데이트
  if(!waitingToStart)
  {
    Game.GetInstance().UpdateObject(gameSpeed, deltaTime);
    Game.GetInstance().DrawObject();
  }  

  // if (!gameover && !waitingToStart) {
  //   // update
  //   // 선인장
  //   ground.update(gameSpeed, deltaTime);
  //   cactiController.update(gameSpeed, deltaTime);
  //   itemController.update(gameSpeed, deltaTime);
  //   // 달리기
  //   player.update(gameSpeed, deltaTime);
  //   updateGameSpeed(deltaTime);

  //   score.update(deltaTime);
  // }

  // if (!gameover && cactiController.collideWith(player)) {
  //   gameover = true;
  //   score.setHighScore();
  //   setupGameReset();
  // }

  // const collideWithItem = itemController.collideWith(player);
  // if (collideWithItem && collideWithItem.itemId) {
  //   score.getItem(collideWithItem.itemId);
  // }

  // // draw
  // player.draw();
  // cactiController.draw();
  // ground.draw();
  // score.draw();
  // itemController.draw();

  if (gameover) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  // 재귀 호출 (무한반복)
  requestAnimationFrame(gameLoop);
}

// 게임 프레임을 다시 그리는 메서드
requestAnimationFrame(gameLoop);

window.addEventListener('keyup', reset, { once: true });