class User {
    constructor(userUUID, socket) {
        this.userUUID = userUUID;
        this.socket = socket;
        this.score = 0;
        this.verifyScore = 0;
        this.currentStage = 1;
        this.scoreMultiple = 1;
    }

    update() {
        this.score += this.scoreMultiple;

        console.log(`UserID : ${this.userUUID} Score : ${this.score}`);
    }
}

export default User;