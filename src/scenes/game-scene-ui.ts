import * as Phaser from 'phaser';
import GameSetting from '../constants/GameSetting';
import { ScoreDisplay } from '../entity/ScoreDisplay';
import { ScoreGain } from '../entity/ScoreGain';
import { Timebar } from '../entity/Timebar';

export class GameSceneUI extends Phaser.Scene {
  private _timeBar: Timebar | null = null;

  private _scoreDisplay: ScoreDisplay | null = null;
  private _scoreGain: ScoreGain | null = null;

  constructor() {
    super({
      key: 'GameSceneUI'
    });
  }

  init(): void {
  }

  create() {
    this._timeBar = new Timebar(this)
    this._scoreDisplay = new ScoreDisplay(this)
    this._scoreGain = new ScoreGain(this)
  }

  updateTimerBar(level: number) {
    let currentTime = GameSetting.TIME.MAX - level * GameSetting.TIME.REDUCE;
    this._timeBar?.startTimer(currentTime <= GameSetting.TIME.MIN ? GameSetting.TIME.MIN : currentTime);
  }

  stopTimerBar() {
    this._timeBar?.stopTimer()
  }

  updateScore(x: number, y: number, score: number,scoreGain: number) {
    this._scoreDisplay?.updateScore(score)
    this.showScoreGain(x, y, scoreGain)
  }

  update(): void {
    this._timeBar?.update();
  }

  showScoreGain(x: number, y: number, score: number) {
    this._scoreGain?.playScoreGain(x, y, score)
  }
}
