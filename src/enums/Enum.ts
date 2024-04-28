export enum Dirs {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    UP = "UP",
    DOWN = "DOWN",
}

export enum GlobalEvent {
    SCORE = "score",
    WRONG = "wrong",
    CORRECT = "correct",
    OVER = 'over',
    WIN='win',
    MUTE='mute',
    LEVEL_SELECT='level_select',
    GAME_START='game_Start',
    SFX_UI='sfx_ui',
    MUTE_SFX="mute_sfx",
    MUTE_BGM="mute_bgm",
    BOUNCE_SFX="bounce_sfx",
    GET_SFX="get_sfx",
    POINT_SFX="point_sfx",
    BANG_SFX="bang_sfx",
}

export enum GameState {
    READY = "ready",
    SCORING = "scoring",
    OVER = "over",
    RETRY = "retry"
}


export enum GameScenes {
    BOOT = "boot_scene",
    LEVEL_SELECT="level_select_scene",
    MENU = "menu_scene_scene",
    GAME_GAME = "game_scene",
    GAME_DISPLAY = "game_display_scene",
    GAME_CONTROL = "game_control_scene",
    AUDIO_MANAGER = "audio_manager_scene",
    MENU_CONTROL="menu_control_scene"
}

