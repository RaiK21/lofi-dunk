import * as Phaser from 'phaser';
import GameScreen from '../constants/GameScreen';

export class MainMenuScene extends Phaser.Scene {

  private startKey: Phaser.Input.Keyboard.Key;
  // private titleBitmapText: Phaser.GameObjects.BitmapText;
  // private playBitmapText: Phaser.GameObjects.BitmapText;
  private titleText: Phaser.GameObjects.Text | null = null
  private btnText: Phaser.GameObjects.Text | null = null
  private circles: Phaser.Geom.Circle []= []

  constructor() {
    super({
      key: 'MainMenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.startKey.isDown = false;
  }

  create(): void {
        this.graphics = this.add.graphics({ lineStyle: { color: 0x828282 }, fillStyle: { color: 0x828282 }});

        for (let y = 0; y < 8; y++)
        {
            for (let x = 0; x <5; x++)
            {
                this.circles.push(new Phaser.Geom.Circle(20 + x * Phaser.Math.Between(100, 200), 20 + y * Phaser.Math.Between(100, 200), Phaser.Math.Between(-20, 20)));
            }
        }

    
        this.btnText = this.add.text(GameScreen.CENTER_X, GameScreen.QUARTER_Y * 3, 'Touch To Start!').setOrigin(0.5).setFontSize(48).setAlign("center")
        this.btnText.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff)
    
        this.titleText = this.add.text(GameScreen.CENTER_X, GameScreen.QUARTER_Y, 'SHADOW\nDUNK').setOrigin(0.5).setFontSize(128).setAlign("center")
        this.titleText.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);

        this.startBtn = this.add.sprite(0, 0, 'dot').setScale(GameScreen.WIDTH,GameScreen.HEIGHT).setInteractive().on('pointerup', () => {
          this.scene.start('GameScene');
        }, this).setOrigin(0).setAlpha(0.01)

      //   const chain1 = this.tweens.chain({
      //     targets: this.titleText,
      //     tweens: [
      //         {
      //             y: this.titleText.y,
      //             scaleX: 0.9,
      //             duration: 150,
      //             ease: 'sine.out'
      //         },
      //         {
      //             y: this.titleText.y+30,
      //             scaleX: 1,
      //             duration: 150,
      //             ease: 'sine.in'
      //         },
      //     ],
      //     loop: -1,
      //     loopDelay: 300,
      // });

      this.tweens.chain({
        targets: this.btnText,
        tweens: [
            {
                y: this.btnText.y,
                scaleX: 0.9,
                duration: 100,
                ease: 'cubic.out'
            },
            {
                y: this.btnText.y+10,
                scaleX: 1,
                duration: 100,
                ease: 'sine.out'
            },
        ],
        loop: -1,
        loopDelay: 300,
    });
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('GameScene');
    }

    this.graphics.clear();

        for (let i = 0; i < this.circles.length; i++)
        {
            const circle = this.circles[i];

            circle.radius +=0.5;
            if (circle.radius >= 20)
            {
                circle.radius -= 40;
            }
            circle.setPosition(circle.x+1,circle.y+1)
            if(circle.x>=GameScreen.WIDTH)
            {
            circle.setPosition(0,circle.y)
            }

            if(circle.y>=GameScreen.HEIGHT)
            {
            circle.setPosition(circle.x,0)
            }

            if (!circle.isEmpty())
            {
                this.graphics.fillCircleShape(circle);
            }
            else
            {
                this.graphics.strokeCircleShape(circle);
            }
    }
  }

  private getCenterXPositionOfBitmapText(width: number): number {
    return this.sys.canvas.width / 2 - width / 2;
  }
}
