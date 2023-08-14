import * as Phaser from 'phaser';
import { BootScene } from './scenes/boot-scene';
import { GameScene } from './scenes/game-scene';
import { MainMenuScene } from './scenes/main-menu-scene';
export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Lofi Dunk',
  type: Phaser.AUTO,
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [BootScene, MainMenuScene, GameScene],
  input: {
    keyboard: true
  },
  physics: {
    default: 'matter',
    matter: {
      // enableSleeping: true
      debug:true,
    }
  },
  backgroundColor: '#000',
  // render: { pixelArt: true, antialias: false }
};