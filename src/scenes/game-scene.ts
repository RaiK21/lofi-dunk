import { Vector } from 'matter';
import * as Phaser from 'phaser';
import GameScreen from '../constants/GameScreen';
import GameSetting from '../constants/GameSetting';
import { Rim } from '../entity/rim';
import { ScoreDisplay } from '../entity/ScoreDisplay';
import { Timebar } from '../entity/Timebar';
import { Dirs, GameState, GlobalEvent } from '../enums/Enum';
import GlobalEventEmitter from '../event/Event';
import { GameSceneUI } from './game-scene-ui';

export class GameScene extends Phaser.Scene {
  private ball: Phaser.Physics.Matter.Image | null = null;
  private rim: Rim | null = null;
  private _gameState: GameState = GameState.READY;
  private _gameDir: Dirs = Dirs.LEFT;
  private _ballVelocity: Vector = { x: 0, y: 0 };
  private _level: number = 0;
  private _score: number = 0;
  private _comboCount: number = 1;
  private uiScene: GameSceneUI | null = null;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.registry.set('score', -1);
    this.setupEvent();
    this.scene.launch('GameSceneUI');
    this.uiScene = this.scene.get('GameSceneUI') as GameSceneUI
  }

  create() {
    this.matter.world.setBounds(-GameScreen.QUARTER_X, 0, GameScreen.WIDTH * 1.5, GameScreen.HEIGHT * 0.875, 32, false, false, false, true);

    //#region Ball
    this.ball = this.matter.add.image(GameScreen.CENTER_X, GameScreen.CENTER_Y, 'ball')
    this.ball.setCircle(this.ball.width * 0.5).setFriction(0.005).setBounce(1);
    //#endregion
    //#region rim
    this.rim = new Rim(this, {
      x: -GameScreen.WIDTH,
      y: -GameScreen.HEIGHT,
    })
    this._setNextLevel();
    //#endregion

    //#region Controls
    const cursors = this.input.keyboard?.createCursorKeys();
    this.space = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 1.0
    };
    // this.add.text(0, 0, 'Use Cursors to scroll camera.\nClick to Quit', { font: '18px Courier', fill: '#00ff00' }).setScrollFactor(0);
    this.input.keyboard?.on(Phaser.Input.Keyboard.KeyCodes.SPACE, this.bounce, this);
    this.input.on('pointerdown', this.bounce, this);
    this.space.on('down', this.bounce, this)
    this.input.once('pointerup', function () {
    }, this);
    //#endregion
  }

  private _updateScore() {
    const scoreGain = GameSetting.SCORE.MULTPLIER * this._comboCount;
    this._score += scoreGain;
    this._comboCount = this._comboCount < GameSetting.SCORE.MAX_COMBO ? this._comboCount += 1 : GameSetting.SCORE.MAX_COMBO;


    if (this.rim) {
      let scorePosX: number = 0;
      switch (this._gameDir) {
        case Dirs.LEFT:
          scorePosX = GameScreen.QUARTER_X;
          break;
        case Dirs.RIGHT:
          scorePosX = GameScreen.QUARTER_X * 3;
          break;
      }
      this.uiScene?.updateScore(scorePosX, this.rim?.y, this._score, scoreGain)
    }
  }

  setupEvent() {
    GlobalEventEmitter.on(GlobalEvent.SCORE, () => {
      if (this._gameState === GameState.READY) {
        this._setGameState(GameState.SCORING)
        this._updateScore();
        this._setNextLevel();
      }
    })

    GlobalEventEmitter.on(GlobalEvent.OVER, () => {
      this._setGameState(GameState.OVER)
      this.rim?.moveOut(() => { });
    })
  }

  bounce() {
    this.ball?.setVelocity(this._ballVelocity.x, this._ballVelocity.y);
  }

  private _setGameState(state: GameState) {
    this._gameState = state;
  }

  private _setNextLevel() {
    this.uiScene?.stopTimerBar();
    switch (this._gameDir) {
      case Dirs.LEFT:
        this._gameDir = Dirs.RIGHT;
        this._ballVelocity.x = GameSetting.BALL_FORCE.X;
        this._ballVelocity.y = GameSetting.BALL_FORCE.Y;
        break;
      case Dirs.RIGHT:
        this._gameDir = Dirs.LEFT;
        this._ballVelocity.x = GameSetting.BALL_FORCE.X * -1;
        this._ballVelocity.y = GameSetting.BALL_FORCE.Y;
        break;
    }
    this.rim?.moveOut(() => {
      this.rim?.moveIn(this._gameDir, () => {
        this._setGameState(GameState.READY)
        this.uiScene?.updateTimerBar(this._level);
      })
    });
  }

  // updateTimerBar() {
  //   let currentTime = GameSetting.TIME.MAX - this._level * GameSetting.TIME.REDUCE;
  //   this._timeBar?.startTimer(currentTime <= GameSetting.TIME.MIN ? GameSetting.TIME.MIN : currentTime);
  // }

  update(): void {
    if (this.ball) {
      if (this.ball.x - this.ball.width * 0.5 > GameScreen.WIDTH) {
        this.ball.setX(GameScreen.LEFT - this.ball.width * 0.5)
      }
      else if (this.ball.x + this.ball.width * 0.5 < GameScreen.LEFT) {
        this.ball.setX(GameScreen.RIGHT + this.ball.width * 0.5)
      }
    }
  }
}
