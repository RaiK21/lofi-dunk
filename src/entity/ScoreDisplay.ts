import * as Phaser from 'phaser';
import GameScreen from '../constants/GameScreen';

export class ScoreDisplay extends Phaser.GameObjects.Container {
    private scoreTxt: Phaser.GameObjects.Text | null = null
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.scoreTxt = this.scene.add.text(GameScreen.CENTER_X, GameScreen.QUARTER_Y, '0').setOrigin(0.5).setFontSize(128)
        this.scoreTxt.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
        // text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        this.scene.add.existing(this);
    }

    updateScore(score: number) {
        this.scoreTxt?.setText(score + '')
    }

    updatePos(x: number,y:number) {
        this.scoreTxt?.setPosition(x,y)
    }
}
