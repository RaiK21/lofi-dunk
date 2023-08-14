import { Vector } from 'matter';
import * as Phaser from 'phaser';
import GameScreen from '../constants/GameScreen';
import { Dirs } from '../enums/Enum';
export class Rim extends Phaser.GameObjects.Container {
    private edge1: Phaser.Physics.Matter.Image | null = null;
    private edge2: Phaser.Physics.Matter.Image | null = null;
    private objects: any[] = [];
    private gapRadius: number = 50;
    private colliderLength: number = 10;

    private _lastPosition: Vector = { x: 0, y: 0 }

    private _spawnHeight: Vector = { x: GameScreen.QUARTER_Y, y: GameScreen.QUARTER_Y * 3 }

    constructor(scene: Phaser.Scene, config: { x: number, y: number }) {
        super(scene);
        this.scene = scene;
        this.setPosition(config.x, config.y)
        this.edge1 = this.scene.matter.add.image(-this.gapRadius, 0, 'dot').setStatic(true).setScale(this.colliderLength, this.colliderLength)
        this.objects.push(this.edge1)
        this.edge2 = this.scene.matter.add.image(this.gapRadius, 0, 'dot').setStatic(true).setScale(this.colliderLength, this.colliderLength)
        this.objects.push(this.edge2)



        this.updatePos();
        this.objects.forEach((object) => {
            this.scene.add.existing(object);
        })
        this.scene.add.existing(this);
    }

    updatePos() {
        this.objects.forEach((object) => {
            object.setPosition(object.x + this.x - this._lastPosition.x, object.y + this.y - this._lastPosition.y)
        })
        this._lastPosition.x = this.x;
        this._lastPosition.y = this.y;
    }

    update(): void {
    }

    moveIn(direction: Dirs) {
        let startX;
        let endX;
        switch (direction) {
            case Dirs.LEFT:
                startX = (this.gapRadius + this.colliderLength) * -1 + GameScreen.LEFT
                endX = GameScreen.LEFT + (this.gapRadius + this.colliderLength)
                break;
            case Dirs.RIGHT:
                startX = (this.gapRadius + this.colliderLength) + GameScreen.RIGHT
                endX = GameScreen.RIGHT - (this.gapRadius + this.colliderLength)
                break;
        }
        this.setPosition(startX, this._getRandomY())
        this.updatePos()

        this.scene.tweens.add({
            targets: this,
            x: endX,
            onUpdate: () => {
                this.updatePos()
            },
            ease: 'Sine.easeInOut',
            duration: 250,
            // repeat: -1,
            yoyo: false
        });
    }

    private _getRandomY() {
        return Phaser.Math.FloatBetween(this._spawnHeight.x, this._spawnHeight.y);
    }


}
