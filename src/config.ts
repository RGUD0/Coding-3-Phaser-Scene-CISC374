import Phaser from "phaser";
//import MainScene from "./scenes/mainScene";
import scene1 from "./scenes/scene1";
import scene2 from "./scenes/scene2";
import scene3 from "./scenes/scene3";
import scene4 from "./scenes/scene4";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export const CONFIG = {
    title: "My Untitled Phaser 3 Game",
    version: "0.0.1",
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#ffffff",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [scene1, scene2, scene3, scene4],
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0 },
        },
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
};
