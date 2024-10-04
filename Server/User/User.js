class User {
    constructor(userUUID, socket) {
        this.userUUID = userUUID;
        this.socket = socket;
        this.score = 0;
    }
}

export default User;