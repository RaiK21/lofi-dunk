import * as Phaser from 'phaser';

export class ScoreGain extends Phaser.GameObjects.Container {
    private scoreTxt: Phaser.GameObjects.Text | null = null
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.scoreTxt = this.scene.add.text(0, 0, '+15').setOrigin(0.5).setFontSize(64)
        this.scoreTxt.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff)
        this.add(this.scoreTxt).setAlpha(0)
        // text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        this.scene.add.existing(this);
    }

    playScoreGain(x: number, y: number, score: number) {
        this.setPosition(x, y).setAlpha(1)
        this.scoreTxt?.setText('+' + score)
        this.scene.tweens.add({
            targets: this,
            y: this.y - 60,
            alpha: 0,
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: false
        });
    }

}
