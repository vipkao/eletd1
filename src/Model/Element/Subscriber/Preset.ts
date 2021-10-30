import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { ISubscriber } from "../interfaces";

/**
 * 初期値を指定できる実装。
 */
export class Preset implements ISubscriber {

    private readonly event : EventEmitter;

    private _onNowChanged: EventPort<(count: number, delta: number) => void>;
    get OnNowChanged(): EventPort<(count: number, delta: number) => void> {
        return this._onNowChanged;
    }

    private _count: number;
    get now(): number { return this._count; }
    private _delta: number;
    get delta(): number { return this._delta; }
    private readonly _target: number;
    get target(): number { return this._target; }

    constructor(initial: number, target: number) {
        this._count = initial;
        this._target = target;
        this._delta = 0;

        this.event = new EventEmitter();
        this._onNowChanged = new EventPort("OnNowChanged", this.event);
    }

    Add(count: number): void {
        this._count += count;
        this._delta += count;
        if(this._count < 0) this._count = 0;
        this.event.emit(this._onNowChanged, this._count, count);
    }

    IsGoal(): boolean{
        const ret = this._count >= this.target;
        return ret;
    }
}