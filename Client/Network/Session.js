import { CLIENT_VERSION, PORT } from "../Constant.js";

class Session {
    constructor() {
        this.userId = null;
        this.socket = null;
        this.gInstance = null;
    }

    static GetInstance() {
        if (!this.gInstance) {
            this.gInstance = new Session();
        }

        return this.gInstance;
    }

    Connect() {
        this.socket = io(`http://localhost:${PORT}`, {
            query: {
                clientVersion: CLIENT_VERSION
            }
        });

        this.socket.on("connection", (data) => {
            this.userId = data.useruuid;
        });

        this.socket.on("response", (data) => {
            console.log(data);
        });
    }

    SendEvent(packetType, payload) {
        this.socket.emit("event", {
            userId: this.userId,
            clientVersion: CLIENT_VERSION,
            packetType,
            payload,
        });
    }
}

export default Session;