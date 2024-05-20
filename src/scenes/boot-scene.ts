import * as Phaser from "phaser";
import GameScreen from "../constants/GameScreen";
import { GameScenes} from "../enums/Enum";


export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics | null = null;
  private progressBar: Phaser.GameObjects.Graphics | null = null;
  private _logoImage: Phaser.GameObjects.Image | null = null;
  private _isLoadComplete: boolean = false;
  private _isTransitionDone: boolean = false;

  private _levels: any = [];
  constructor() {
    super({
      key: 'BootScene',
      pack: {
        files: [
          {
            type: "image",
            key: "logo",
            url: "assets/images/logo.png",
          },
        ],
      },
    });
  }

  preload() {
    // set the background and create loading bar
    this.cameras.main.setBackgroundColor(0x000);
    this._logoImage = this.add.image(
      GameScreen.CENTER_X,
      GameScreen.CENTER_Y,
      "logo"
    );
    this.createLoadingbar();
    // pass value to change the loading bar fill
    this.load.on(
      "progress",
      (value: number) => {
        this.progressBar?.clear();
        this.progressBar?.fillStyle(0xfff6d3, 1);
        this.progressBar?.fillRect(
          this.cameras.main.width * 0.25,
          this.cameras.main.height * 0.75 - 16,
          this.cameras.main.width * 0.5 * value,
          16
        );
      },
      this
   );

    this.load.on(
      "complete",
      () => {
        this._isLoadComplete = true;
      },
      this
    );

    this.load.image("logo", "assets/images/logo.png");
    this.load.image("startBtn", "assets/images/button_1.png");
    this.load.image("dot", "assets/images/whiteDot.jpg");
    this.load.image("circle", "assets/images/circle.png");

    this.load.audio("bgm", "assets/Sounds/Music/bgm.mp3");
    this.load.audio("gameover", "assets/Sounds/SE/gg.mp3");
    this.load.audio("ui", "assets/Sounds/SE/ui.mp3");
    this.load.audio("bounce", "assets/Sounds/SE/score2.wav");
    this.load.audio("get", "assets/Sounds/SE/get.mp3");
    this.load.audio("point", "assets/Sounds/SE/block_break.wav");
    this.load.audio("bang", "assets/Sounds/SE/block_hit.wav");
  }

  private _loadLevelData(level: string) {
    this.load.json(level, `data/${level}.json`);
    this._levels.push(level);
  }

  init(): void {
    // this.setupEvent();
  }

  create(): void {
  }

  fadeOutLogoTween(callback?: () => void) {
    const targets=[this._logoImage,this.loadingBar,this.progressBar];
    this.tweens.add({
      targets: targets,
      alpha: 0,
      onStart: () => {
        targets.forEach((target)=>{
          target.alpha=1;
        })
      },
      onComplete: () => {
        if (callback) {
          callback();
        }
      },
      ease: "Sine.easeInOut",
      duration: 1200,
    });
  }

  update(): void {
    if (this._isLoadComplete && !this._isTransitionDone) {
      this._isTransitionDone = true;
      this.fadeOutLogoTween( () => {
        this.scene.launch('MainMenuScene');
        this.scene.launch(GameScenes.AUDIO_MANAGER);
      });
    }
  }

  private createLoadingbar(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x5dae47, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height * 0.75 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
