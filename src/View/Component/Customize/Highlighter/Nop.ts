import { IHighlighter } from "../../interfaces";

export class Nop implements IHighlighter{
    constructor(){}
    SetScene(scene: Phaser.Scene, parent: Phaser.GameObjects.Container): void {
    }
    Start(): void {
    }
    Stop(): void {
    }
    Destory(): void {
    }

}