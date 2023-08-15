import GameScreen from "./GameScreen"

export default class GameSetting {
  static BALL_FORCE = {
    X: 2,
    Y: -10,
  }

  static RIM_Y_RANGE = {
    start: GameScreen.QUARTER_Y,
    end: GameScreen.QUARTER_Y * 3,
  }

  static TIME = {
    MAX: 8000,
    MIN: 3000,
    REDUCE: 100,
  }

  static SCORE = {
    MULTPLIER: 1,
    MAX_COMBO: 10
  }
}