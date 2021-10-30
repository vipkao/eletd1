import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { ISpeedChanger, SpeedType } from "../interfaces";

/**
 * deltaを固定値とする実装。
 */
export class PresetDelta implements ISpeedChanger{

    private readonly normalDelta: number;
    private readonly highDelta: number;

    private _nowSpeed: SpeedType;
    get nowSpeed(): SpeedType {
        return this._nowSpeed;
    }

    private readonly event : EventEmitter;

    private _onChangeDelta: EventPort<(delta: number) => void>;
    get OnDeltaChanged(): EventPort<(delta: number) => void> {
        return this._onChangeDelta;
    }

    get nowDelta(): number{
        const ret = this.GetSpeedDelta(this._nowSpeed);
        return ret;
    }

    constructor(
        normalDelta: number,
        highDelta: number,
        defaultSpeed: SpeedType
    ){
        this.normalDelta = normalDelta;
        this.highDelta = highDelta;
        this._nowSpeed = defaultSpeed;

        this.event = new EventEmitter();
        this._onChangeDelta = new EventPort("OnChangeDelta", this.event);
    }

    ChangeNext(): void {
        this._nowSpeed = this.GetNextSpeed(this._nowSpeed);

        this.event.emit(this._onChangeDelta, this.nowDelta);
    }

    private GetSpeedDelta(speed: SpeedType): number{
        if(speed == "stop") return Number.MAX_VALUE;
        if(speed == "normal") return this.normalDelta;
        if(speed == "high") return this.highDelta;
        if(speed == "max") return 0;
        throw new Error("想定されていないスピードの種類" + speed);
    }

    private GetNextSpeed(speed: SpeedType): SpeedType{
        if(speed == "stop") return "normal";
        if(speed == "normal") return "high";
        if(speed == "high") return "max";
        if(speed == "max") return "stop";
        throw new Error("想定されていないスピードの種類" + speed);
    }

    public toString(){
        const delta = this.nowDelta;
        return `[SpeedChanger:${this.normalDelta},${this.highDelta},${this._nowSpeed},${delta}]`;
    }
}