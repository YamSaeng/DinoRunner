import { GameInit, GameStart, GameEnd, MoveStage, ScoreUpdate } from "./Packet/PacketProc.js";

const packetTypeMappings = {
    10: GameInit,
    11: GameStart,
    12: GameEnd,
    101: MoveStage,
    102: ScoreUpdate
};

export default packetTypeMappings;