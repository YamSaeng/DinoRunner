
export class Stage {
    constructor() {
        this.stages = {};
    }

    CreateStage(uuid) {
        this.stages[uuid] = [];
    }

    SetStage(uuid, currentStageId, scoreMultiple, nextStageId, timestamp) {
        return this.stages[uuid].push({ currentStageId, scoreMultiple, nextStageId, timestamp });
    }

    GetStage(uuid) {
        return this.stages[uuid];
    }

    ClearStage(uuid) {
        this.stages[uuid] = [];
    }
}