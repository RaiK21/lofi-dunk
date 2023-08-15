// import { Bird } from '../objects/bird';
// import { Pipe } from '../objects/pipe';
import { Vector } from 'matter';
import * as Phaser from 'phaser';
import GameScreen from '../constants/GameScreen';
import GameSetting from '../constants/GameSetting';
import { Rim } from '../entity/rim';
import { Dirs, GameState, GlobalEvent } from '../enums/Enum';
import GlobalEventEmitter from '../event/Event';

export class GameScene extends Phaser.Scene {
  // private bird: Bird;
  // private pipes: Phaser.GameObjects.Group;
  // private background: Phaser.GameObjects.TileSprite;
  // private scoreText: Phaser.GameObjects.BitmapText;
  // private timer: Phaser.Time.TimerEvent;
  private ball: Phaser.Physics.Matter.Image | null = null;
  private rim: Rim | null = null;
  private _gameState: GameState = GameState.READY;
  private _gameDir: Dirs = Dirs.LEFT;
  private _ballVelocity: Vector = { x: 0, y: 0 };
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.registry.set('score', -1);
    this.setupEvent();
  }

  create() {
    console.log('%c Game ', 'background: green; color: white; display: block;');

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

  setupEvent() {
    GlobalEventEmitter.on(GlobalEvent.SCORE, () => {
      if (this._gameState !== GameState.SCORING) {
        this._setGameState(GameState.SCORING)
        this._setNextLevel();
      }
    })
  }

  bounce() {
    this.ball?.setVelocity(this._ballVelocity.x, this._ballVelocity.y);
  }

  private _setGameState(state: GameState) {
    this._gameState = state;
  }

  private _setNextLevel() {
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
      })
    });
  }

  update(): void {
    if (this.ball) {
      if (this.ball.x - this.ball.width * 0.5 > GameScreen.WIDTH) {
        this.ball.setX(GameScreen.LEFT - this.ball.width * 0.5)
      }
      else if (this.ball.x + this.ball.width * 0.5 < GameScreen.LEFT) {
        this.ball.setX(GameScreen.RIGHT + this.ball.width * 0.5)
      }
    }

    // if (!this.bird.getDead()) {
    //   this.background.tilePositionX += 4;
    //   this.bird.update();
    //   this.physics.overlap(
    //     this.bird,
    //     this.pipes,
    //     function () {
    //       this.bird.setDead(true);
    //     },
    //     null,
    //     this
    //   );
    // } else {
    //   Phaser.Actions.Call(
    //     this.pipes.getChildren(),
    //     function (pipe: Pipe) {
    //       pipe.body.setVelocityX(0);
    //     },
    //     this
    //   );

    //   if (this.bird.y > this.sys.canvas.height) {
    //     this.scene.start('MainMenuScene');
    //   }
    // }
  }


  private addPipe(x: number, y: number, frame: number): void {
    // create a new pipe at the position x and y and add it to group
    // this.pipes.add(
    //   new Pipe({
    //     scene: this,
    //     x: x,
    //     y: y,
    //     frame: frame,
    //     texture: 'pipe'
    //   })
    // );
  }
}
