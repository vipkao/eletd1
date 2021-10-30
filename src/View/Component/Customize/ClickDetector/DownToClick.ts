import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { IClickDetector } from "../../interfaces";

export class DownToClick implements IClickDetector{

    private readonly event : EventEmitter;
    private readonly _onClicked : EventPort<(x: number, y: number) => void>;
    get OnClicked(): EventPort<(x: number, y: number) => void> {
        return this._onClicked;
    }
    private readonly _onDoubleClicked : EventPort<(x: number, y: number) => void>;
    get OnDoubleClicked(): EventPort<(x: number, y: number) => void> {
        return this._onDoubleClicked;
    }

    private readonly clickBlockMilliSec: number;
    private isClickBlocking: boolean = false;

    constructor(
        clickBlockMilliSec: number
    ){
        this.event = new EventEmitter();
        this._onClicked = new EventPort("OnClicked", this.event);
        this._onDoubleClicked = new EventPort("OnDoubleClicked", this.event);

        this.clickBlockMilliSec = clickBlockMilliSec;
    }

    Down(x: number, y: number): void {
        if(this.isClickBlocking) return;
        this.isClickBlocking = true;
        this.event.emit(this._onClicked, x, y);
        setInterval(() => {
            this.isClickBlocking = false;
        }, this.clickBlockMilliSec);

    }
    Up(x: number, y: number): void {
        //NOP
    }

    Destory(): void{
        this._onClicked.removeAllListeners();
        this._onDoubleClicked.removeAllListeners();
    }

}