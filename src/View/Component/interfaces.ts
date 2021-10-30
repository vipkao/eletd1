import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";

/**
 * 領域を持続的に強調表示する機能。デフォルトでStart。
 */
export interface IHighlighter{
    SetScene(scene: Phaser.Scene, parent: Phaser.GameObjects.Container): void;
    Start(): void;
    Stop(): void;
    Destory(): void;
}

/**
 * 領域を一時的に強調表示する機能。デフォルトでStop。
 */
export interface IFlasher{
    get OnFlashEnded(): EventPort<() => void>;
    SetScene(scene: Phaser.Scene, parent: Phaser.GameObjects.Container): void;
    Start(): void;
    Destory(): void;
}

/**
 * クリックを検出する機能。
 */
export interface IClickDetector{
    get OnClicked(): EventPort<(x: number, y:number) => void>;
    get OnDoubleClicked(): EventPort<(x: number, y:number) => void>;
    Down(x: number, y:number): void;
    Up(x: number, y:number): void;
    Destory(): void;
}