import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { ITickWorker } from "../interfaces";

export class EmitEvent implements ITickWorker{

    private readonly event : EventEmitter;
    
    private readonly _onDone : EventPort<(tick: number) => void>;
    get OnDone(): EventPort<(tick: number) => void>{
        return this._onDone;
    }

    constructor(){
        this.event = new EventEmitter();
        this._onDone = new EventPort("OnDone", this.event);
    }

    Do(tick: number): void {
        this.event.emit(this._onDone, tick);
    }

}