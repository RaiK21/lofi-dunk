import * as Phaser from 'phaser';
import GameScreen from '../constants/GameScreen';
import { GlobalEvent } from '../enums/Enum';
import GlobalEventEmitter from '../event/Event';

export class Timebar extends Phaser.GameObjects.Container {
    private _timer: Phaser.Time.TimerEvent | null = null;
    private _graphics;

    private _progress: number = 0;
    private _barWidth: number = GameScreen.QUARTER_X * 3
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this._graphics = this.scene.add.graphics({ x: 0, y: 0 });
        this.scene.add.existing(this);
    }

    startTimer(time: number) {
        this._timer = this.scene.time.addEvent({
            delay: time, loop: false, callback: () => {
                GlobalEventEmitter.emit(GlobalEvent.OVER)
            }
        })
    }

    stopTimer() {
        this._timer?.remove()
    }

    update() {
        // console.log(0xffffff)
        if (this._timer?.getProgress) {
            this._progress = this._timer?.getProgress()
        }

        if (this._progress < 1) {
            this._graphics.clear();
            this._graphics.fillStyle(0xffffff, 1);
            const progress = this._barWidth - this._barWidth * (this._progress <= 0.99 ? this._progress : 1);
            this._graphics.fillRect(GameScreen.QUARTER_X*0.5, GameScreen.CENTER_Y * 0.125, progress, 32);
        }
    }
}
