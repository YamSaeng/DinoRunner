
export class Stage {
    constructor() {
        this.stages = {};
    }

    CreateStage(uuid) {
        this.stages[uuid] = [];
    }

    SetStage(uuid, id, timestamp) {
        return this.stages[uuid].push({ id, timestamp });
    }

    GetStage(uuid) {
        return this.stages[uuid];
    }

    ClearStage(uuid) {
        this.stages[uuid] = [];
    }
}