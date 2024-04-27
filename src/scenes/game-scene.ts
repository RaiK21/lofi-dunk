import { Vector } from "matter";
import * as Phaser from "phaser";
import GameScreen from "../constants/GameScreen";
import GameSetting from "../constants/GameSetting";
import { Rim } from "../entity/rim";
import { Dirs, GameState, GlobalEvent } from "../enums/Enum";
import GlobalEventEmitter from "../event/Event";
import { GameSceneUI } from "./game-scene-ui";

export class GameScene extends Phaser.Scene {
  private ball: Phaser.Physics.Matter.Image | null = null;
  private floor: Phaser.Physics.Matter.Image | null = null;
  private ceiling: Phaser.Physics.Matter.Image | null = null;
  private rim: Rim | null = null;
  private _gameState: GameState = GameState.READY;
  private _gameDir: Dirs = Dirs.LEFT;
  private _ballVelocity: Vector = { x: 0, y: 0 };
  private _level: number = 0;
  private _score: number = 0;
  private _comboCount: number = GameSetting.SCORE.START_COMBO;
  private uiScene: GameSceneUI | null = null;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {
    this.registry.set("score", -1);
    this.setupEvent();
    this.scene.launch("GameSceneUI");
    this.uiScene = this.scene.get("GameSceneUI") as GameSceneUI;
  }

  create() {
    this.graphics = this.add.graphics({
      lineStyle: { color: 0x828282 },
      fillStyle: { color: 0x828282 },
    });

    this.circles = [];

    for (let y = 0; y < 14; y++) {
      for (let x = 0; x < 8; x++) {
        this.circles.push(
          new Phaser.Geom.Circle(
            20 + x * Phaser.Math.Between(100, 200),
            20 + y * Phaser.Math.Between(100, 200),
            Phaser.Math.Between(-20, 20)
          )
        );
      }
    }

    // this.matter.world.setBounds(-GameScreen.QUARTER_X, 0, GameScreen.WIDTH * 1.5, GameScreen.HEIGHT * 0.875, 32, false, false, false, true);
    //#region Ball
    this.ball = this.matter.add.image(
      GameScreen.CENTER_X,
      GameScreen.CENTER_Y,
      "circle"
    );
    this.ball
      .setCircle(this.ball.width * 0.5)
      .setFriction(0.005)
      .setBounce(1);
    
    this.ceiling = this.matter.add
      .image(
        GameScreen.CENTER_X,
        GameScreen.HEIGHT * 0.01,
        "dot",
        undefined,
        {
          label: "ceiling",
          isStatic: true,
        }
      )
      .setScale(GameScreen.WIDTH * 1.5, GameScreen.HEIGHT * 0.02)
      .setTint(0x828282, 0x828282, 0x828282, 0x828282);

    this.floor = this.matter.add
      .image(
        GameScreen.CENTER_X,
        GameScreen.HEIGHT * 0.9375,
        "dot",
        undefined,
        {
          label: "floor",
          isStatic: true,
        }
      )
      .setScale(GameScreen.WIDTH * 1.5, GameScreen.HEIGHT * 0.125);
    //#endregion
    //#region rim
    this.rim = new Rim(this, {
      x: -GameScreen.WIDTH,
      y: -GameScreen.HEIGHT,
    });
    this._setNextLevel();
    //#endregion

    //#region Controls
    const cursors = this.input.keyboard?.createCursorKeys();
    this.space = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
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
      maxSpeed: 1.0,
    };
    // this.add.text(0, 0, 'Use Cursors to scroll camera.\nClick to Quit', { font: '18px Courier', fill: '#00ff00' }).setScrollFactor(0);
    this.input.keyboard?.on(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      this.bounce,
      this
    );
    this.input.on("pointerdown", this.bounce, this);
    this.space.on("down", this.bounce, this);
    this.input.once("pointerup", function () {}, this);

    this.startBtn = this.add
      .sprite(0, 0, "dot")
      .setScale(GameScreen.WIDTH, GameScreen.HEIGHT)
      .setInteractive()
      .on(
        "pointerup",
        () => {
          this.scene.restart();
        },
        this
      )
      .setOrigin(0)
      .setAlpha(0);

    //#endregion
    this._setupEvent();
  }

  private _setupEvent() {
    this.matter.world.on("collisionstart", (event) => {
      //  Loop through all of the collision pairs
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;
        //  We only want sensor collisions
        if (pairs[i].isSensor) {
        } else {
          if (bodyA.label === "floor" || bodyB.label === "floor") {
            this._comboCount = GameSetting.SCORE.START_COMBO;
          }
        }
      }
    });
  }

  private _updateScore() {
    const scoreGain = GameSetting.SCORE.MULTPLIER * this._comboCount;
    this._score += scoreGain;
    this._comboCount =
      this._comboCount < GameSetting.SCORE.MAX_COMBO
        ? (this._comboCount += 1)
        : GameSetting.SCORE.MAX_COMBO;

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
      this.uiScene?.updateScore(scorePosX, this.rim?.y, this._score, scoreGain);
    }
  }

  setupEvent() {
    GlobalEventEmitter.on(GlobalEvent.SCORE, () => {
      if (this._gameState === GameState.READY) {
        this._setGameState(GameState.SCORING);
        this._updateScore();
        this._setNextLevel();
      }
    });

    GlobalEventEmitter.on(GlobalEvent.OVER, () => {
      this._setGameState(GameState.OVER);
      this.rim?.moveOut(() => {
        this._setGameState(GameState.RETRY);
        this.uiScene?.updateGameOver();
        this.startBtn.setAlpha(0.01);
      });   
    });
  }

  bounce() {
    switch(this._gameState){
      case GameState.OVER:
        break;
      case GameState.RETRY:
        this.scene.restart();
        this._gameState=GameState.OVER;
        break;
      default:
        this.ball?.setVelocity(this._ballVelocity.x, this._ballVelocity.y);

    }
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
        this._setGameState(GameState.READY);
        this.uiScene?.updateTimerBar(this._level);
      });
    });
  }

  // updateTimerBar() {
  //   let currentTime = GameSetting.TIME.MAX - this._level * GameSetting.TIME.REDUCE;
  //   this._timeBar?.startTimer(currentTime <= GameSetting.TIME.MIN ? GameSetting.TIME.MIN : currentTime);
  // }

  update(): void {
    this.graphics.clear();
    for (let i = 0; i < this.circles.length; i++) {
      const circle = this.circles[i];

      circle.radius += 0.5;
      if (circle.radius >= 20) {
        circle.radius -= 40;
      }

      if (!circle.isEmpty()) {
        this.graphics.fillCircleShape(circle);
      } else {
        this.graphics.strokeCircleShape(circle);
      }
    }
    if (this.ball) {
      if (this.ball.x - this.ball.width * 0.5 > GameScreen.WIDTH) {
        this.ball.setX(GameScreen.LEFT - this.ball.width * 0.5);
      } else if (this.ball.x + this.ball.width * 0.5 < GameScreen.LEFT) {
        this.ball.setX(GameScreen.RIGHT + this.ball.width * 0.5);
      }
    }
  }
}
