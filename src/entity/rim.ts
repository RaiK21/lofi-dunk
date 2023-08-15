import { Vector } from 'matter';
import * as Phaser from 'phaser';
import GameScreen from '../constants/GameScreen';
import { Dirs, GlobalEvent } from '../enums/Enum';
import GlobalEventEmitter from '../event/Event';
export class Rim extends Phaser.GameObjects.Container {
    private edge1: Phaser.Physics.Matter.Image | null = null;
    private edge2: Phaser.Physics.Matter.Image | null = null;
    private sensor1: Phaser.Physics.Matter.Image | null = null;
    private sensor2: Phaser.Physics.Matter.Image | null = null;
    private hitLog: string[] = [];
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


        this.sensor1 = this.scene.matter.add.image(0, 10, 'dot', undefined, {
            label: 'topSensor',
            isSensor: true,
            isStatic: true,
        }).setScale(this.colliderLength, this.colliderLength)
        this.objects.push(this.sensor1)

        this.sensor2 = this.scene.matter.add.image(0, 40, 'dot', undefined, {
            label: 'btmSensor',
            isSensor: true,
            isStatic: true,
        }).setScale(this.colliderLength, this.colliderLength)
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
                        this.hitLog.push('topSensor')
                    }
                    if (bodyA.label === 'btmSensor' || bodyB.label === 'btmSensor') {
                        this.hitLog.push('btmSensor')
                        if (this.hitLog[0] === 'topSensor') {
                            GlobalEventEmitter.emit(GlobalEvent.SCORE)
                        }
                    }
                }
            }
        });

        this.scene.matter.world.on('collisionEnd', event => {
            //  Loop through all of the collision pairs
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const bodyA = pairs[i].bodyA;
                const bodyB = pairs[i].bodyB;
                //  We only want sensor collisions
                if (pairs[i].isSensor) {
                    this.hitLog = [];
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
