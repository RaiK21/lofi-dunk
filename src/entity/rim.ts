import * as Phaser from 'phaser';
export class Rim extends Phaser.GameObjects.Container {
    private edge1: Phaser.Physics.Matter.Image | null = null;
    private edge2: Phaser.Physics.Matter.Image | null = null;

    private objects: any[] = [];

    constructor(scene: Phaser.Scene, config: { x: number, y: number }) {
        super(scene);
        this.scene = scene;
        this.setPosition(config.x, config.y)
        this.edge1 = this.scene.matter.add.image(-100, 0, 'dot').setStatic(true).setScale(50, 10)
        this.edge2 = this.scene.matter.add.image(100, 0, 'dot').setStatic(true).setScale(50, 10)
        this.objects.push(this.edge1)
        this.objects.push(this.edge2)
        this.updatePos();
        this.objects.forEach((object) => {
            this.scene.add.existing(object);
        })
    }

    updatePos() {
        this.objects.forEach((object) => {
            object.setPosition(object.x + this.x, object.y + this.y)
        })
    }

    update(): void {
    }

    moveIn() {
        this.scene.tweens.add({
            targets: this,
            x: 0,
            ease: 'Sine.easeInOut',
            duration: 1000,
            // repeat: -1,
            yoyo: false
        });
    }


}
