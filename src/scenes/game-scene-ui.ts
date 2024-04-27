import * as Phaser from "phaser";
import GameSetting from "../constants/GameSetting";
import { ScoreDisplay } from "../entity/ScoreDisplay";
import { ScoreGain } from "../entity/ScoreGain";
import { Timebar } from "../entity/Timebar";
import GameScreen from "../constants/GameScreen";

export class GameSceneUI extends Phaser.Scene {
  private _timeBar: Timebar | null = null;

  private _scoreDisplay: ScoreDisplay | null = null;
  private _scoreGain: ScoreGain | null = null;
  private _scoreText: Phaser.GameObjects.Text | null = null;
  private _btnText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({
      key: "GameSceneUI",
    });
  }

  init(): void {}

  create() {
    this._timeBar = new Timebar(this);
    this._scoreDisplay = new ScoreDisplay(this);
    this._scoreGain = new ScoreGain(this);
    this._scoreText = this.add
      .text(GameScreen.CENTER_X, GameScreen.QUARTER_Y, "Score")
      .setOrigin(0.5)
      .setFontSize(92);
    this._scoreText.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
    this._scoreText.setVisible(false);
    this._btnText = this.add
      .text(GameScreen.CENTER_X, GameScreen.QUARTER_Y * 3, "Retry?")
      .setOrigin(0.5)
      .setFontSize(48)
      .setAlign("center");
    this._btnText.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
    this._btnText.setVisible(false);
  }

  updateTimerBar(level: number) {
    let currentTime = GameSetting.TIME.MAX - level * GameSetting.TIME.REDUCE;
    this._timeBar?.startTimer(
      currentTime <= GameSetting.TIME.MIN ? GameSetting.TIME.MIN : currentTime
    );
  }

  stopTimerBar() {
    this._timeBar?.stopTimer();
  }

  updateScore(x: number, y: number, score: number, scoreGain: number) {
    this._scoreDisplay?.updateScore(score)
    this.showScoreGain(x, y, scoreGain);
  }

  update(): void {
    this._timeBar?.update();
  }

  showScoreGain(x: number, y: number, score: number) {
    this._scoreGain?.playScoreGain(x, y, score);
  }

  updateGameOver() {
    this._scoreText?.setVisible(true);
    this._scoreDisplay?.updatePos(GameScreen.CENTER_X, GameScreen.HEIGHT * 0.4);
    this._btnText?.setVisible(true);

    if (this._btnText) {
      this.tweens.chain({
        targets: this._btnText,
        tweens: [
          {
            y: this._btnText?.y,
            scaleX: 0.9,
            duration: 100,
            ease: "cubic.out",
          },
          {
            y: this._btnText?.y + 10,
            scaleX: 1,
            duration: 100,
            ease: "sine.out",
          },
        ],
        loop: -1,
        loopDelay: 300,
      });
    }
  }
}
