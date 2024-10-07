import {
    S2C_PACKET_TYPE_GAME_INIT,
    S2C_PACKET_TYPE_GAME_START,
    S2C_PACKET_TYPE_MOVE_STAGE,
    S2C_PACKET_TYPE_RANK_SCORE_UPDATE,
    S2C_PACKET_TYPE_ERROR,
    ITEM_PLUS_SCORE,
    CACTUS_MINUS_SCORE
} from "../Constant.js"
import { getGameAssets } from "../Contents/assets.js"

export const GameInit = (uuid, payload, Stage, users) => {
    const { stages } = getGameAssets();

    Stage.ClearStage(uuid);

    const currentStage = {
        currentStageId: stages.data[0].currentStageId,
        goalScore: stages.data[0].goalScore,
        scoreMultiple: stages.data[0].scoreMultiple,
        nextStageId: stages.data[0].nextStageId
    };

    Stage.SetStage(uuid,
        currentStage.currentStageId,
        currentStage.scoreMultiple,
        currentStage.nextStageId,
        payload.timestamp);

    return {
        isBroadCast: false, exceptMe: false,
        packetType: S2C_PACKET_TYPE_GAME_INIT,
        data: { currentStage, uuid }
    }
}

// 서버에서 게임시작
export const GameStart = (uuid, payload, Stage, users) => {
    let scoreArray = users.map((user) => {
        const score = [];
        score.push({
            userUUID: user.userUUID,
            score: user.score,
            currentStage: user.currentStage
        });
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
        return {
            isBroadCast: false, exceptMe: false,
            packetType: S2C_PACKET_TYPE_ERROR,
            data: "ERROR 스테이지를 찾을 수 없습니다."
        };
    }

    currentStages.sort((a, b) => a.currentStageId - b.currentStageId);
    const currentStage = currentStages[currentStages.length - 1];

    if (currentStage.currentStageId !== payload.currentStage) {
        return {
            isBroadCast: false, exceptMe: false,
            packetType: S2C_PACKET_TYPE_ERROR,
            data: "ERROR 현재 스테이지가 맞지 않습니다."
        }
    }

    const serverTime = Date.now(); // 현재 서버 시간    

    let User = users.find(user => user.userUUID == uuid);
    if (User) {
        console.log(`서버 점수 : ${User.score} 유저 점수 : ${payload.score}`);

        if (Math.abs(User.score - payload.score) > 10) {
            return {
                isBroadCast: false, exceptMe: false,
                packetType: S2C_PACKET_TYPE_ERROR,
                data: "ERROR 점수 에러"
            }
        }

        const { stages } = getGameAssets();
        let nextStage = stages.data.find(stage => stage.currentStageId === payload.nextStage);
        if (!nextStage) {
            return {
                isBroadCast: false, exceptMe: false,
                packetType: S2C_PACKET_TYPE_ERROR,
                data: "ERROR 다음 스테이지를 찾을 수 없습니다."
            }
        }

        users.forEach(user => {
            if (user.userUUID === uuid) {
                user.currentStage = nextStage.currentStageId;
                user.scoreMultiple = nextStage.scoreMultiple;
            }
        });

        Stage.SetStage(uuid, nextStage.currentStageId, nextStage.scoreMultiple, nextStage.nextStageId, serverTime);

        return {
            isBroadCast: false, exceptMe: false,
            packetType: S2C_PACKET_TYPE_MOVE_STAGE,
            data: nextStage
        };
    }
}

export const ScoreUpdate = (uuid, payload, Stage, users) => {
    users.forEach(user => {
        if (user.userUUID === uuid) {
            user.score = payload.score;
        }
    });

    let currentStages = Stage.GetStage(uuid);
    if (currentStages) {
        if (!currentStages.length) {
            return { status: "실패", message: "[MoveStage] 스테이지를 찾을 수 없습니다." };
        }

        currentStages.sort((a, b) => a.currentStageId - b.currentStageId);

        const currentStage = currentStages[currentStages.length - 1];
        if (currentStage) {
            if (currentStage.currentStageId !== payload.currentStage) {
                return { status: "실패", message: "현재 스테이지가 맞지 않습니다." };
            }
        }

        return {
            isBroadCast: true,
            exceptMe: false,
            packetType: S2C_PACKET_TYPE_RANK_SCORE_UPDATE,
            data: { userUUID: uuid, score: payload.score, currentStage: currentStage.currentStageId }
        };
    }
}

export const GetItem = (uuid, payload, Stage, users) => {
    users.forEach(user => {
        if (user.userUUID === uuid) {
            user.SetScore(ITEM_PLUS_SCORE);
        }
    });

    return null;
}

export const CollideCactus = (uuid, payload, Stage, users) => {
    let currentStages = Stage.GetStage(uuid);
    if (!currentStages.length) {
        return {
            isBroadCast: false, exceptMe: false,
            packetType: S2C_PACKET_TYPE_ERROR,
            data: "ERROR 스테이지를 찾을 수 없습니다."
        };
    }

    currentStages.sort((a, b) => a.currentStageId - b.currentStageId);
    const currentStage = currentStages[currentStages.length - 1];   

    users.forEach(user => {
        if (user.userUUID === uuid) {
            user.SetScore(-CACTUS_MINUS_SCORE * currentStage.scoreMultiple);
        }
    });

    return null;
}