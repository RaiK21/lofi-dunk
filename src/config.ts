import * as Phaser from 'phaser';
import { BootScene } from './scenes/boot-scene';
import { GameScene } from './scenes/game-scene';
import { GameSceneUI } from './scenes/game-scene-ui';
import { MainMenuScene } from './scenes/main-menu-scene';
export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Shadow Dunk',
  type: Phaser.AUTO,
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [BootScene, MainMenuScene, GameScene, GameSceneUI],
  input: {
    keyboard: true
  },
  physics: {
    default: 'matter',
    matter: {
      // enableSleeping: true
      debug: false,
    }
  },
  backgroundColor: '#000',
  // render: { pixelArt: true, antialias: false }
};