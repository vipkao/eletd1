import { SaveData } from "#/Model/Element/SaveData";
import { ISubscriber } from "Model/Element/interfaces";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { IStageNexter } from "../interfaces";

/**
 * retry時は登録者数が戻る実装。
 */
export class RetryBack implements IStageNexter{

    private readonly event : EventEmitter;
    
    private readonly _onNext : EventPort<(saveData: SaveData) => void>;
    get OnNext(): EventPort<(saveData: SaveData) => void>{
        return this._onNext;
    }

    private readonly _onRetry : EventPort<(saveData: SaveData) => void>;
    get OnRetry(): EventPort<(saveData: SaveData) => void> {
        return this._onRetry;
    }

    private readonly _onTitle : EventPort<(saveData: SaveData) => void>;
    get OnTitle(): EventPort<(saveData: SaveData) => void> {
        return this._onTitle;
    }

    private readonly subscriber: ISubscriber;
    private readonly saveData: SaveData;
    private readonly prev: number;

    constructor(
        subscriber: ISubscriber,
        saveData: SaveData
    ){
        this.event = new EventEmitter();
        this._onNext = new EventPort("OnNext", this.event);
        this._onRetry = new EventPort("OnRetry", this.event);
        this._onTitle = new EventPort("OnTitle", this.event);

        this.subscriber = subscriber;
        this.saveData = saveData;
        this.prev = subscriber.now;
    }

    Next(): void {
        this.saveData.subscribers = this.subscriber.now;
        this.event.emit(this._onNext, this.saveData);
    }

    Retry(): void {
        this.saveData.subscribers = this.prev;
        this.event.emit(this._onRetry, this.saveData);
    }

    Title(): void {
        this.saveData.subscribers = 0;
        this.event.emit(this._onTitle, this.saveData);
    }

}