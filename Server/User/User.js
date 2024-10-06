class User {
    constructor(userUUID, socket) {
        this.userUUID = userUUID;
        this.socket = socket;
        this.score = 0;
        this.verifyScore = 0;
        this.currentStage = 1;
        this.scoreMultiple = 1;
    }

    Update() {
        this.score += this.scoreMultiple;

        console.log(`UserID : ${this.userUUID} Score : ${this.score}`);
    }

    SetScore(score)
    {
        this.score += score;

        if (this.score < 0) {
            this.score = 0;
        }
    }
}

export default User;