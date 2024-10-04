import { getGameAssets } from "../Contents/assets.js"

// 서버에서 게임시작
export const GameStart = (uuid, payload, Stage) => {    
    const { stages } = getGameAssets();

    Stage.ClearStage(uuid);

    Stage.SetStage(uuid, stages.data[0].id, payload.timestamp);
    console.log("스테이지: ", Stage.GetStage(uuid));

    return { status: "게임시작" };
}

// 게임 끝
export const GameEnd = (uuid, payload, Stage) => {
    console.log("게임 끝");
}

// 스테이지 옮기기
export const MoveStage = (uuid, payload, Stage) => {        
    let currentStages = Stage.GetStage(uuid);    
    if(!currentStages.length)
    {
        return { status: "실패", message:"[MoveStage] 스테이지를 찾을 수 없습니다."};
    }

    currentStages.sort((a,b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    console.log(currentStage);

    if (currentStage.id !== payload.currentStage) {
        return { status: "실패", message: "현재 스테이지가 맞지 않습니다." };
    }
    
    const serverTime = Date.now(); // 현재 서버 시간
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

    const { stages} = getGameAssets();
    if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status: "실패", message: "목표 스테이지를 찾을 수 없습니다." }
    }

    Stage.SetStage(uuid, payload.targetStage, serverTime);

    console.log(currentStages);

    return { status: "스테이지 옮기기 성공" }
}
