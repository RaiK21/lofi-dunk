import * as Phaser from 'phaser';
import GameSetting from '../constants/GameSetting';
import { ScoreDisplay } from '../entity/ScoreDisplay';
import { Timebar } from '../entity/Timebar';

export class GameSceneUI extends Phaser.Scene {
  private _timeBar: Timebar | null = null;

  private _scoreDisplay: ScoreDisplay | null = null;

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
  }

  updateTimerBar(level: number) {
    let currentTime = GameSetting.TIME.MAX - level * GameSetting.TIME.REDUCE;
    this._timeBar?.startTimer(currentTime <= GameSetting.TIME.MIN ? GameSetting.TIME.MIN : currentTime);
  }

  stopTimerBar() {
    this._timeBar?.stopTimer()
  }

  updateScore(score: number) {
    this._scoreDisplay?.updateScore(score)
  }

  update(): void {
    this._timeBar?.update();
  }
}
