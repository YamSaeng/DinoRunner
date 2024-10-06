import { GameServer } from "./Server/GameServer.js"

let gameServer = new GameServer();
gameServer.ServerStart();

setInterval(()=> {
    gameServer.Update();
}, 10);