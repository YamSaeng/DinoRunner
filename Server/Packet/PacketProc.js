import { S2C_PACKET_TYPE_GAME_INIT, S2C_PACKET_TYPE_GAME_START, S2C_PACKET_TYPE_RANK_SCORE_UPDATE } from "../Constant.js"
import { getGameAssets } from "../Contents/assets.js"

export const GameInit = (uuid, payload, Stage, users) => {  
    const { stages } = getGameAssets();

    Stage.ClearStage(uuid);

    Stage.SetStage(uuid, stages.data[0].id, stages.data[0].scoreMultiple, payload.timestamp);    

    return { isBroadCast: false, exceptMe:false, packetType: S2C_PACKET_TYPE_GAME_INIT, data : { goalScore: stages.data[0].goalScore, scoreMultiple : stages.data[0].scoreMultiple }}
}

// 서버에서 게임시작
export const GameStart = (uuid, payload, Stage, users) => {   
    let scoreArray = users.map((user) => {
        const score = [];
        score.push({ userUUID: user.userUUID, score: user.score });
        return score;
    });

    return { isBroadCast: true, exceptMe: false, packetType: S2C_PACKET_TYPE_GAME_START, data: scoreArray };
}

// 게임 끝
export const GameEnd = (uuid, payload, Stage, users) => {
    console.log("게임 끝");
}

// 스테이지 옮기기
export const MoveStage = (uuid, payload, Stage, users) => {
    let currentStages = Stage.GetStage(uuid);
    if (!currentStages.length) {
        return { status: "실패", message: "[MoveStage] 스테이지를 찾을 수 없습니다." };
    }

    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    if (currentStage.id !== payload.currentStage) {
        return { status: "실패", message: "현재 스테이지가 맞지 않습니다." };
    }

    const serverTime = Date.now(); // 현재 서버 시간
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

    const { stages } = getGameAssets();
    if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status: "실패", message: "목표 스테이지를 찾을 수 없습니다." }
    }

    Stage.SetStage(uuid, payload.targetStage, serverTime);

    return { status: "스테이지 옮기기 성공" }
}

export const ScoreUpdate = (uuid, payload, Stage, users) => {
    users.forEach(user => {
        if (user.userUUID === uuid) {
            user.score = payload.score;
        }
    });

    return { isBroadCast: true, exceptMe: false, packetType: S2C_PACKET_TYPE_RANK_SCORE_UPDATE, data: { userUUID: uuid, score: payload.score } };
}
