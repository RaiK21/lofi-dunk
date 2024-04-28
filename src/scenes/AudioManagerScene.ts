import * as Phaser from "phaser";
import GameSetting from "../constants/GameSetting";
import GlobalEventEmitter from "../event/Event";
import { GameScenes, GlobalEvent } from "../enums/Enum";

export class AudioManagerScene extends Phaser.Scene {
  private _bgMusic:
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.WebAudioSound;
  // private _bgYay: any[] = [];
  private _sfxGameOver: any;
  private _sfxUI: any;
  private _sfxBounce: any;
  private _sfxGet: any;
  private _sfxPoint: any;
  private _sfxBang: any;

  constructor() {
    super({
      key: GameScenes.AUDIO_MANAGER,
    });
  }

  init(): void {
    this._setupEvent();
  }

  private _setupEvent() {
    GlobalEventEmitter.on(GlobalEvent.CORRECT, this.playCorrect, this);
    GlobalEventEmitter.on(GlobalEvent.BOUNCE_SFX, this.playBounce, this);
    GlobalEventEmitter.on(GlobalEvent.GET_SFX, this.playGet, this);
    GlobalEventEmitter.on(GlobalEvent.POINT_SFX, this.playPoint, this);
    GlobalEventEmitter.on(GlobalEvent.BANG_SFX, this.playBang, this);
    GlobalEventEmitter.on(GlobalEvent.WRONG, this.playWrong, this);
    GlobalEventEmitter.on(GlobalEvent.OVER, this.updateGameOver, this);
    GlobalEventEmitter.on(GlobalEvent.WIN, this.updateGameWin, this);
    GlobalEventEmitter.on(GlobalEvent.MUTE, this.updateMute, this);
    GlobalEventEmitter.on(GlobalEvent.SFX_UI, this.playUI, this);
    GlobalEventEmitter.on(GlobalEvent.GAME_START, this.startLevel, this);
  }

  create() {
    this._bgMusic = this.sound.add("bgm");
    this._bgMusic.loop = true;

    // for (let index = 0; index < 3; index++) {
    //   const sound = this.sound.add(`yay${index + 1}`);
    //   this._bgYay.push(sound);
    // }

    this._sfxUI = this.sound.add("ui");
    this._sfxGameOver = this.sound.add("gameover");
    this._sfxBounce = this.sound.add("bounce");
    this._sfxGet = this.sound.add("get");
    this._sfxPoint = this.sound.add("point");
    this._sfxBang = this.sound.add("bang");
  }

  playCorrect() {
    // const index = Math.floor(Math.random() * this._bgYay.length);
    // this._bgYay[index].play();
  }

  playWrong() {
    const index = Math.floor(Math.random() * this._sfxWrong.length);
    this._sfxWrong[index].play();
    this._sfxBreak.play();
  }

  update(): void {
    // this._timeBar?.update();
  }

  showScoreGain(x: number, y: number, progress: string) {}

  updateGameWin() {}

  updateGameOver() {
    this._bgMusic.stop();
    this._sfxGameOver.play();
  }

  updateMute() {
    this.sound.setVolume(this.sound.volume >= 1 ? 0 : 1);
  }

  playUI() {
    this._sfxUI.play();
  }

  playBounce() {
    this._sfxBounce.play();
  }

  playGet() {
    this._sfxGet.play();
  }

  playPoint() {
    this._sfxPoint.play();
  }

  playBang() {
    this._sfxBang.play();
  }

  startLevel() {
    this._bgMusic.play();
  }
}
