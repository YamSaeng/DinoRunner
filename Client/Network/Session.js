import { CLIENT_VERSION, PORT, 
    S2C_PACKET_TYPE_GAME_INIT, 
    S2C_PACKET_TYPE_GAME_START,
    S2C_PACKET_TYPE_RANK_SCORE_UPDATE } from "../Constant.js";
import Game from "../Game.js";

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

            console.log("S2C_Connect userUUID : ", this.userId);
        });

        this.socket.on("response", (data) => {
            
            switch(data.packetType)
            {
                case S2C_PACKET_TYPE_GAME_INIT:
                    Game.GetInstance().SetGameInit(data.data);
                    break;
                case S2C_PACKET_TYPE_GAME_START:                    
                    Game.GetInstance().SetRankScores(data.data);
                    break;
                case S2C_PACKET_TYPE_RANK_SCORE_UPDATE:                                             
                    Game.GetInstance().SetRankScore(data.data);            
                    break;                    
            }

            //console.log(data);
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