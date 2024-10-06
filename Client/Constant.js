export const PORT = 3020;
export const CLIENT_VERSION = "1.0.0";
export const WINDOW_LEFT = 0;
export const WINDOW_RIGHT = 900;

export const GRAVITY = 0.4;

export const PLAYER_SPEED = 0.2;
export const PLAYER_JUMP_SPEED = 0.6;

export const GAME_SPEED_START = 1;
export const GAME_SPEED_INCREMENT = 0.00001;

// 게임 크기
export const MAIN_GAME_CANVAS_WIDTH = 900;
export const MAIN_GAME_CANVAS_HEIGHT = 200;

export const RANK_SCORE_CANVAS_WIDTH = 300;
export const RANK_SCORE_CANVAS_HEIGHT = 300;

// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
export const PLAYER_WIDTH = 88 / 1.5;
export const PLAYER_HEIGHT = 94 / 1.5;
export const MAX_JUMP_HEIGHT = MAIN_GAME_CANVAS_HEIGHT;
export const MIN_JUMP_HEIGHT = 150;

// 땅
export const GROUND_WIDTH = 2400;
export const GROUND_HEIGHT = 24;
export const GROUND_SPEED = 0.2;

// 불꽃
export const FIRE_SPEED = 0.7;
export const FIRE_ANIMATION_TIME = 10;
export const FIRE_ANIMATION_START_SPRITE_INDEX = 2;
export const FIRE_COUNT = 5;
export const FIRE_ATTACK_TIMER = 200;

export const OBJECT_TYPE_PLAYER = 101;
export const OBJECT_TYPE_FIRE = 102;
export const OBJECT_TYPE_POKET_BALL = 103;
export const OBJECT_TYPE_CACTUS = 104;

export const JOB_TYPE_CREATE_OBJECT_FIRE = 1001;

export const C2S_SCORE_SEND_TIME = 1000;

export const C2S_PACKET_TYPE_GAME_INIT = 10;
export const C2S_PACKET_TYPE_GAME_START = 11;
export const C2S_PACKET_TYPE_GAME_END = 12;

export const C2S_PACKET_TYPE_MOVE_STAGE = 101;

export const S2C_PACKET_TYPE_GAME_INIT = 103;
export const S2C_PACKET_TYPE_GAME_START = 104;
export const S2C_PACKET_TYPE_RANK_SCORE_UPDATE = 105;
export const S2C_PACKET_TYPE_MOVE_STAGE = 106;

export const C2S_PACKET_TYPE_GET_ITEM = 107;
export const S2C_PACKET_TYPE_GET_ITEM = 108;

export const C2S_PACKET_TYPE_COLLIDE_CACTUS = 109;

export const S2C_PACKET_TYPE_USER_DISCONNECT = 1001;

export const S2C_PACKET_TYPE_ERROR = 404;
export const S2C_PACKET_TYPE_NEW_HIGH_SCORE = 405;
