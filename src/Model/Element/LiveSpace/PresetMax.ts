import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { ILiveSpace, IMember } from "../interfaces";

/**
 * 配信枠の最大値を指定できる実装。初期状態は空っぽ。
 */
export class PresetMax implements ILiveSpace {

    private readonly event : EventEmitter;

    private _onSpaceStarted: EventPort<(index: number, member: IMember) => void>;
    get OnSpaceStarted(): EventPort<(index: number, member: IMember) => void> {
        return this._onSpaceStarted;
    }

    private _onSpaceStoped: EventPort<(index: number, member: IMember) => void>;
    get OnSpaceStoped(): EventPort<(index: number, member: IMember) => void> {
        return this._onSpaceStoped;
    }

    private _max: number;
    get max(): number { return this._max;}

    private _space: (IMember | null)[];
    get space(): (IMember | null)[] {
        return this._space.concat();
    }
    
    constructor(
        max: number,    
    ) {
        this.event = new EventEmitter();
        this._onSpaceStarted = new EventPort("OnSpaceStarted", this.event);
        this._onSpaceStoped = new EventPort("OnSpaceStoped", this.event);
        
        this._max = max;
        this._space = [...Array(max)].map(_ => null);
    }

    SetMember(index: number, member: IMember | null): void {
        if(index < 0) throw new Error("index < 0:" + index);
        if(index > this._max - 1) throw new Error("index < max:" + index);

        if(member === null){
            const stopMember = this._space[index];
            this._space[index] = member;
            if(stopMember !== null)
                this.event.emit(this._onSpaceStoped, index, stopMember);    
        }else{
            this._space[index] = member;
            this.event.emit(this._onSpaceStarted, index, member);
        }
    }

    public toString(){
        const ls = this._space.map(m => {
            if(m === null) return "-";
            return m.name;
        }).reduce((a, b) => a+","+b)
        return `[LiveSpace:${ls}]`;
    }    
}