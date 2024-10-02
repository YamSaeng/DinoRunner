import express from "express";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { v4 as uuidV4 } from "uuid";

import { loadGameAssets } from "./Contents/assets.js";

export class GameServer {

    constructor() {
        this.express = express();
        this.server = createServer(this.express);
        this.PORT = 3020;
        this.users = [];
    }

    ServerStart() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(express.static("Client"));

        const socketIO = new SocketIO();
        socketIO.attach(this.server);

        // 애셋 읽어오기
        this.AssetLoad();

        // 서버 Listen 시작
        this.Listen();

        // Aceept 시작
        this.Accept(socketIO);        
    }

    async AssetLoad() {
        try {
            const assets = await loadGameAssets();            
            console.log("애셋 정보 읽기 완료");
        }
        catch(e){
            console.log("애셋 정보 읽어오기 실패 ", e);
        }
    }

    Listen() {
        this.express.get('/', (req, res) => {
            res.send("hi 3020");
        });

        this.server.listen(this.PORT, async () => {
            console.log(`GameServer Open PORT : ${this.PORT}`)
        });
    }

    Accept(socketIO) {
        socketIO.on('connect', (socket) => {
            const userUUID = uuidV4();
            this.AddUser({ uuid: userUUID, socketId: socket });
        })
    }

    AddUser(user) {
        this.users.push(user);
        console.log(`유저 접속 : ${user.uuid} 소켓 ID : ${user.socket.id}`);
    }

    RemoveUser(id) {
        const index = this.users.findIndex((user) => user.id == id);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }

    GetUser() {
        return this.users;
    }
}