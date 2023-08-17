import { Vector } from 'matter';
import * as Phaser from 'phaser';
import GameScreen from '../constants/GameScreen';
import { Dirs, GlobalEvent } from '../enums/Enum';
import GlobalEventEmitter from '../event/Event';
export class Rim extends Phaser.GameObjects.Container {
    private edge1: Phaser.Physics.Matter.Image | null = null;
    private edge2: Phaser.Physics.Matter.Image | null = null;
    private edge3: Phaser.Physics.Matter.Image | null = null;
    private sensor1: Phaser.Physics.Matter.Image | null = null;
    private sensor2: Phaser.Physics.Matter.Image | null = null;
    private hitLog: string[] = [];
    private objects: any[] = [];
    private gapRadius: number = 50;
    private colliderLength: number = 10;
    private rimLength = {
        x: 10,
        y: 50
    };

    private sensorLen = {
        x: 40,
        y: 10
    };

    private _lastPosition: Vector = { x: 0, y: 0 }

    private _spawnHeight: Vector = { x: GameScreen.QUARTER_Y, y: GameScreen.QUARTER_Y * 3 }

    private _lastDir: Dirs = Dirs.LEFT;
    constructor(scene: Phaser.Scene, config: { x: number, y: number }) {
        super(scene);
        this.scene = scene;
        this.setPosition(config.x, config.y)
        this.edge1 = this.scene.matter.add.image(-this.gapRadius, 0, 'dot').setStatic(true).setScale(this.rimLength.x, this.rimLength.y)
        this.objects.push(this.edge1)

        this.edge2 = this.scene.matter.add.image(this.gapRadius, 0, 'dot').setStatic(true).setScale(this.rimLength.x, this.rimLength.y)
        this.objects.push(this.edge2)

        this.edge3 = this.scene.matter.add.image(0, this.rimLength.y * 0.5 - this.rimLength.x * 0.5, 'dot').setStatic(true).setSensor(true).setScale(this.rimLength.y * 2, this.rimLength.x)
        this.objects.push(this.edge3)

        this.sensor1 = this.scene.matter.add.image(0, -10, 'dot', undefined, {
            label: 'topSensor',
            isSensor: true,
            isStatic: true,
        }).setScale(this.sensorLen.x, this.sensorLen.y).setAlpha(0)
        this.objects.push(this.sensor1)

        this.sensor2 = this.scene.matter.add.image(0, 30, 'dot', undefined, {
            label: 'btmSensor',
            isSensor: true,
            isStatic: true,
        }).setScale(this.sensorLen.x, this.sensorLen.y).setAlpha(0)
        this.objects.push(this.sensor2)

        this.updatePos();
        this.objects.forEach((object) => {
            this.scene.add.existing(object);
        })
        this.scene.add.existing(this);



        this.scene.matter.world.on('collisionstart', event => {
            //  Loop through all of the collision pairs
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const bodyA = pairs[i].bodyA;
                const bodyB = pairs[i].bodyB;
                //  We only want sensor collisions
                if (pairs[i].isSensor) {
                    if (bodyA.label === 'topSensor' || bodyB.label === 'topSensor') {
                        this._updateHitLog('topSensor')
                    }
                    if (bodyA.label === 'btmSensor' || bodyB.label === 'btmSensor') {
                        this._updateHitLog('btmSensor')
                        if (this.hitLog[0] === 'topSensor') {
                            GlobalEventEmitter.emit(GlobalEvent.SCORE)
                        }
                    }
                }
            }
        });

        this.scene.matter.world.on('collisionend', event => {
            //  Loop through all of the collision pairs
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const bodyA = pairs[i].bodyA;
                const bodyB = pairs[i].bodyB;
                //  We only want sensor collisions
                if (pairs[i].isSensor) {
                    this._updateHitLog()
                }
            }
        });
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

    moveIn(direction: Dirs, callback: () => void) {
        this._lastDir = direction;
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
            onComplete: () => {
                this._updateHitLog()
                callback()
            },
            ease: 'Sine.easeInOut',
            duration: 250,
            // repeat: -1,
            yoyo: false
        });
    }

    moveOut(callback: () => void) {
        let startX;
        let endX;
        switch (this._lastDir) {
            case Dirs.LEFT:
                startX = (this.gapRadius + this.colliderLength) * -1 + GameScreen.LEFT
                endX = GameScreen.LEFT + (this.gapRadius + this.colliderLength)
                break;
            case Dirs.RIGHT:
                startX = (this.gapRadius + this.colliderLength) + GameScreen.RIGHT
                endX = GameScreen.RIGHT - (this.gapRadius + this.colliderLength)
                break;
        }
        this.scene.tweens.add({
            targets: this,
            x: startX,
            onUpdate: () => {
                this.updatePos()
            },
            onComplete: () => {
                callback()
            },
            ease: 'Sine.easeInOut',
            duration: 250,
            // repeat: -1,
            yoyo: false
        });
    }

    private _updateHitLog(log: string = '') {
        if (log === '') {
            this.hitLog = [];
        }
        else {
            this.hitLog.push(log);
        }
    }

    private _getRandomY() {
        return Phaser.Math.FloatBetween(this._spawnHeight.x, this._spawnHeight.y);
    }


}
