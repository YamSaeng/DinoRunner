import express from "express";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { v4 as uuidV4 } from "uuid";

import { loadGameAssets } from "./Contents/assets.js";
import { PORT } from "./Constant.js";
import { CLIENT_VERSION, S2C_PACKET_TYPE_USER_DISCONNECT } from "../Server/Constant.js";
import packetTypeMaapings from "./PacketType.js";
import { Stage } from "./Contents/Stage.js";

import User from "./User/User.js";

export class GameServer {
    constructor() {
        this.express = express();
        this.server = createServer(this.express);
        this.PORT = PORT;
        this.users = [];
        this.stage = new Stage();
        this.userID = 1;
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
        catch (e) {
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

        // connection이라는 이벤트가 발생할 때까지 대기한다.
        // 서버에 접속하는 모든 유저들을 대상으로 하는 이벤트를 탐지한다.
        socketIO.on('connection', (socket) => {
            const userUUID = this.userID;//uuidV4();                     
            this.AddUser(new User(userUUID, socket));

            this.userID++;

            // Recv Event 등록
            socket.on("event", (data) => this.Recv(socketIO, socket, data));
            // Disconnect Event 등록
            socket.on("disconnect", (socket) => { this.Disconnect(socket, userUUID) });            
        })
    }

    Recv(io, socket, data) {
        if (!CLIENT_VERSION.includes(data.clientVersion)) {
            socket.emit("response", { status: "실패", message: "클라이언트 버전이 맞지 않습니다." });
            return;
        }

        const packetType = packetTypeMaapings[data.packetType];
        if (!packetType) {
            socket.emit("response", { status: "실패", message: `${data.packetType} Packet Type을 찾을 수 없습니다.` });
            return;
        }

        const response = packetType(data.userId, data.payload, this.stage, this.users);
        if (response.isBroadCast == true) {
            if (response.exceptMe == true) {
                this.BroadCastExceptMe(data.userId, { packetType: response.packetType, data: response.data });
            }
            else {
                this.BroadCast({ packetType: response.packetType, data: response.data });
            }
        }
        else {
            socket.emit("response", { packetType: response.packetType, data: response.data });
        }
    }

    // socket으로 transfer close가 들어옴
    // uuid로 유저 삭제
    Disconnect(socket, uuid) {
        console.log(`소켓 연결이 해제 되었습니다. ${uuid}`);

        const response = {packetType : S2C_PACKET_TYPE_USER_DISCONNECT, data: uuid};
        this.BroadCastExceptMe(uuid, response);
        this.RemoveUser(uuid);
    }

    AddUser(newUser) {
        this.users.push(newUser);

        console.log(`유저 접속 : ${newUser.userUUID} 소켓 ID : ${newUser.socket.id}`);

        this.stage.CreateStage(newUser.userUUID);

        newUser.socket.emit("connection", { useruuid: newUser.userUUID });
    }

    RemoveUser(id) {
        const index = this.users.findIndex((user) => user.userUUID == id);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }

    GetUser() {
        return this.users;
    }

    BroadCast(data) {
        this.users.forEach(user => {
            user.socket.emit("response", data);
        });
    }

    BroadCastExceptMe(uuid, data) {
        this.users.forEach(user => {
            if (user.userUUID != uuid) {
                user.socket.emit("response", data);
            }
        });
    }
}