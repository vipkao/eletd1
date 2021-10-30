import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { IAudience, IPosition } from "../interfaces";
import { LiveTaste } from "../LiveTaste";
import { Invalid } from "../Position/Invalid";
import { IMoveRoute } from "./interfaces";

/**
 * 単純に全ての項目をコンストラクタで指定できる実装。
 */
export class FullCustom implements IAudience{

    private readonly event : EventEmitter;

    private _onPositionChanged: EventPort<(data: IAudience, position: IPosition) => void>;
    get OnPositionChanged(): EventPort<(data: IAudience, position: IPosition) => void> {
        return this._onPositionChanged;
    }

    private _onLogin: EventPort<(audience: IAudience) => void>;
    get OnLogin(): EventPort<(audience: IAudience) => void>{
        return this._onLogin;
    }

    private _onSatisfactionUp: EventPort<(audience: IAudience, score: number) => void>;
    get OnSatisfactionUp(): EventPort<(audience: IAudience, score: number) => void>{
        return this._onSatisfactionUp;
    }

    private _onSubscribed: EventPort<(audience: IAudience, score: number) => void>;
    get OnSubscribed(): EventPort<(audience: IAudience, score: number) => void>{
        return this._onSubscribed;
    }

    private _onDisappointed: EventPort<(audience: IAudience, score: number) => void>;
    get OnDisappointed(): EventPort<(audience: IAudience, score: number) => void>{
        return this._onDisappointed;
    }

    private readonly _id: number;
    get id(): number { return this._id; }

    private _position: IPosition;
    get position(): IPosition { return this._position; }

    private readonly initListenTick: number;
    private nowListenTick: number;

    private readonly _maxSatisfaction: number;
    get maxSatisfaction(): number { return this._maxSatisfaction; }
    private nowSatisfaction: number;

    private readonly subscribedScore: number;
    private readonly disappointedScore: number;

    private isLogin: boolean;
    private isSubscribed: boolean;
    private isDisappointed: boolean;

    private readonly _liveTaste: LiveTaste;
    get liveTaste(): LiveTaste{ return this._liveTaste; }

    private readonly moveWait: number;
    private readonly moveEnd: number;
    private moveCount: number;
    private readonly moveRoute: IMoveRoute;

    constructor(
        id: number,
        initListenTick: number,
        maxSatisfaction: number,
        subscribedScore: number,
        disappointedScore: number,
        moveWait: number,
        moveEnd: number,
        moveRoute: IMoveRoute,
        liveTaste: LiveTaste
    ){
        this.event = new EventEmitter();
        this._onPositionChanged = new EventPort("OnPositionChanged", this.event);
        this._onLogin = new EventPort("OnLogin", this.event);
        this._onSatisfactionUp = new EventPort("OnSatisfactionUp", this.event);
        this._onSubscribed = new EventPort("OnSubscribed", this.event);
        this._onDisappointed = new EventPort("OnDisappointed", this.event);

        this._position = new Invalid();

        this._id = id;

        this.initListenTick = initListenTick;
        this.nowListenTick = initListenTick;

        this._maxSatisfaction = maxSatisfaction;
        this.nowSatisfaction = 0;

        this.subscribedScore = subscribedScore;
        this.disappointedScore = disappointedScore;

        this.isLogin = false;
        this.isSubscribed = false;
        this.isDisappointed = false;

        this._liveTaste = liveTaste;

        this.moveWait = moveWait;
        this.moveEnd = moveEnd;
        this.moveRoute = moveRoute;
        this.moveCount = 0;

    }
    ListenLive(): void {
        if(this.nowListenTick === 0){
            this.nowListenTick = this.initListenTick;
            return;
        }
        this.nowListenTick--;
    }
    IsListenFinished(): boolean {
        if(this.nowListenTick == 0)
            return true;
        return false;
    }

    AddSatisfaction(value: number): void {
        if(this.IsSatisfied()) return;
        this.nowSatisfaction += value;
        this.event.emit(this._onSatisfactionUp, this, value);
    }

    IsSatisfied(): boolean {
        if(this.nowSatisfaction < this._maxSatisfaction)
            return false;
        return true;
    }

    IsExist(): boolean {
        return this.isLogin && !this.isSubscribed && !this.isDisappointed;
    }

    Move(): void {
        if(this.isSubscribed) return;
        if(this.isDisappointed) return;

        if(this.moveCount < this.moveWait){
            this.moveCount++;
            return;
        }

        if(this.moveCount === this.moveWait){
            const p = this.moveRoute.Calc(this.moveCount - this.moveWait);
            this.SetPosition(p);
            this.moveCount++;
            this.isLogin = true;
            this.event.emit(this._onLogin, this);
            return;
        }

        if(this.moveCount === this.moveEnd + this.moveWait){
            this.isDisappointed = true;
            this.event.emit(this._onDisappointed, this, this.disappointedScore);
            return;
        }

        const p = this.moveRoute.Calc(this.moveCount - this.moveWait);
        this.SetPosition(p);

        this.moveCount++;
    }

    DoSubscribe(): void {
        if(!this.IsSatisfied()) return;
        if(this.isSubscribed) return;
        if(this.isDisappointed) return;

        this.isSubscribed = true;
        this.event.emit(this._onSubscribed, this, this.subscribedScore);
    }

    SetPosition(position: IPosition): void {
        this._position = position;
        this.event.emit(this._onPositionChanged, this, this._position);
    }

    IsEnd(): boolean {
        return this.isSubscribed || this.isDisappointed;
    }

    Clone(): IAudience{
        return new FullCustom(
            this.id,
            this.initListenTick,
            this._maxSatisfaction,
            this.subscribedScore, this.disappointedScore,
            this.moveWait, this.moveEnd, this.moveRoute, this.liveTaste
        );
    }

    public toString(): string{
        const ret = `[Aud:${this._position}]`;
        return ret;
    }

}