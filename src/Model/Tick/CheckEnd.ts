import { Audiences } from "../Element/Audiences";
import { ISubscriber } from "../Element/interfaces";
import { ITickWorker } from "../Updater/interfaces";
import { EventEmitter, EventPort } from "../Utils/EventEmitter";

/**
 * 全リスナーが終了したかを判定する実装。
 */
export class CheckEnd implements ITickWorker{

    private readonly event : EventEmitter;
    
    private readonly _onSuccessEnded : EventPort<() => void>;
    get OnSuccessEnded(): EventPort<() => void>{
        return this._onSuccessEnded;
    }
    
    private readonly _onFailEnded : EventPort<() => void>;
    get OnFailEnded(): EventPort<() => void>{
        return this._onFailEnded;
    }
    
    private readonly audiences : Audiences;
    private readonly subscriber: ISubscriber;

    private isEnded: boolean = false;

    constructor(
        audiences : Audiences,
        subscriber: ISubscriber
    ){
        this.event = new EventEmitter();
        this._onSuccessEnded = new EventPort("OnSuccessEnded", this.event);
        this._onFailEnded = new EventPort("OnFailEnded", this.event);

        this.audiences = audiences;
        this.subscriber = subscriber;
    }


    Do(tick: number): void {
        if(!this.audiences.IsEnd()) return;
        if(this.isEnded) return;

        this.isEnded = true;

        if(this.subscriber.IsGoal()){
            this.event.emit(this._onSuccessEnded);
            return;
        }
        this.event.emit(this._onFailEnded);
        return;
    }

}