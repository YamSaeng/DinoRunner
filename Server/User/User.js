class User {
    constructor(userUUID, socket) {
        this.userUUID = userUUID;
        this.socket = socket;
        this.score = 0;        
        this.currentStage = 1;
        this.scoreMultiple = 1;
    }

    // 점수 업데이트
    Update() {
        this.score += this.scoreMultiple;        
    }

    // 점수 설정
    SetScore(score)
    {
        this.score += score;

        if (this.score < 0) {
            this.score = 0;
        }
    }
}

export default User;