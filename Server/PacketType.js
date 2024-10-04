import { GameStart, GameEnd, MoveStage } from "./Game/Game.js";

const packetTypeMappings = {
    11: GameStart,
    12: GameEnd,
    101: MoveStage
};

export default packetTypeMappings;