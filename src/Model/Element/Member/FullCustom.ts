import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { IAudience, ILiveSpace, IMember, IPosition } from "../interfaces";
import { LiveTaste } from "../LiveTaste";
import { Invalid } from "../Position/Invalid";
import { IListenDetector } from "./interfaces";

/**
 * 単純に全ての項目をコンストラクタで指定できる実装。
 */
export class FullCustom implements IMember{

    private readonly event : EventEmitter;

    private _onLiveStarted: EventPort<(data: IMember) => void>;
    get OnLiveStarted(): EventPort<(data: IMember) => void> {
        return this._onLiveStarted;
    }

    private _onLiveEnded: EventPort<(data: IMember) => void>;
    get OnLiveEnded(): EventPort<(data: IMember) => void> {
        return this._onLiveEnded;
    }

    private _onPositionChanged: EventPort<(data: IMember, position: IPosition) => void>;
    get OnPositionChanged(): EventPort<(data: IMember, position: IPosition) => void> {
        return this._onPositionChanged;
    }

    private isLive: boolean;

    private readonly _id: number;
    get id(): number { return this._id; }

    private _position: IPosition;
    get position(): IPosition { return this._position; }

    private _name: string;
    get name(): string { return this._name; }

    private readonly _liveTaste: LiveTaste;
    get liveTaste(): LiveTaste{ return this._liveTaste; }

    private readonly listenDetector: IListenDetector;
    
    constructor(
        id: number,
        name: string,
        listenDetector: IListenDetector,
        liveTaste: LiveTaste
    ){

        this.event = new EventEmitter();
        this._onPositionChanged = new EventPort("OnPositionChanged", this.event);
        this._onLiveStarted = new EventPort("OnLiveStarted", this.event);
        this._onLiveEnded = new EventPort("OnLiveEnded", this.event);

        this._id = id;
        this._name = name;
        this._position = new Invalid();
        this.isLive = false;
        this._liveTaste = liveTaste;
        this.listenDetector = listenDetector;
    }

    StartLive(): void {
        this.isLive = true;
        this.event.emit(this._onLiveStarted, this);
    }

    EndLive(): void {
        this.isLive = false;
        this.event.emit(this._onLiveEnded, this);
    }

    IsLive(): boolean {
        return this.isLive;
    }

    IsListened(audience: IAudience): boolean {
        if(!this.isLive) return false;

        const ret = this.listenDetector.IsListen(audience.position, this.position);
        
        return ret;
    }

    SetPosition(position: IPosition): void {
        this._position = position;
        this.event.emit(this._onPositionChanged, this, this._position);
    }

    public toString(): string{
        const ret = `[name:${this._name}]${this._position}`;
        return ret;
    }

}