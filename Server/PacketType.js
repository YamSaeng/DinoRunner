import { GameInit, GameStart, GameEnd, MoveStage, GetItem, CollideCactus } from "./Packet/PacketProc.js";

const packetTypeMappings = {
    10: GameInit, // 게임 초기화
    11: GameStart, // 게임 시작
    12: GameEnd, // 게임 끝
    101: MoveStage, // 스테이지 이동
    107: GetItem, // 아이템 습득
    109: CollideCactus // 선인장 충돌
};

export default packetTypeMappings;