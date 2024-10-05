class User {
    constructor(userUUID, socket) {
        this.userUUID = userUUID;
        this.socket = socket;
        this.score = 0;
        this.currentStage = 1;
    }
}

export default User;