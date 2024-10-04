
export class Stage {
    constructor() {
        this.stages = {};
    }

    CreateStage(uuid) {
        this.stages[uuid] = [];
    }

    SetStage(uuid, id, scoreMultiple, timestamp) {
        return this.stages[uuid].push({ id, scoreMultiple, timestamp });
    }

    GetStage(uuid) {
        return this.stages[uuid];
    }

    ClearStage(uuid) {
        this.stages[uuid] = [];
    }
}