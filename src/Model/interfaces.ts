import { SaveData } from "./Element/SaveData";
import { EventPort } from "./Utils/EventEmitter";


/**
 * ゲームのタイトルの機能。
 */
export interface ITitle{
    get OnStageSelected(): EventPort<(index: number) => void>;
    Start(saveData: SaveData): void;
    Destroy(): void;
}
export interface ITitleFactory{
    //分岐させるためにここで渡す
    Create(saveData: SaveData): ITitle;
}

/**
 * ゲームの１ステージの機能。
 */
export interface IPlayStage{
    get OnNextStage(): EventPort<(saveData: SaveData) => void>;
    get OnRetryStage(): EventPort<(saveData: SaveData) => void>;
    get OnGoTitle(): EventPort<(saveData: SaveData) => void>;
    get title(): string;
    get caption(): string;
    Start(): void;
    Destroy(): void;
}
export interface IPlayStageFactory{
    Create(saveData: SaveData): IPlayStage;
}

/**
 * ゲームのエンディングの機能。
 */
export interface IEnding{
    get OnExit(): EventPort<() => void>;
    Start(): void;
    Destroy(): void;
}
export interface IEndingFactory{
    //分岐させるためにここで渡す
    Create(saveData: SaveData) : IEnding;
}
