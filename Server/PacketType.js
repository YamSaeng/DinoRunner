import { GameInit, GameStart, GameEnd, MoveStage, GetItem, CollideCactus } from "./Packet/PacketProc.js";

const packetTypeMappings = {
    10: GameInit,
    11: GameStart,
    12: GameEnd,
    101: MoveStage,    
    107: GetItem,
    109: CollideCactus
};

export default packetTypeMappings;