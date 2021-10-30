import { EventPort } from "../Utils/EventEmitter";
import { LiveTaste } from "./LiveTaste";

/**
 * ディフェンスするメンバーの機能。
 */
export interface IMember extends IPositionSettable<IMember>{
    get OnLiveStarted(): EventPort<(member: IMember) => void>;
    get OnLiveEnded(): EventPort<(member: IMember) => void>;
    get id(): number;
    get name(): string;
    get liveTaste(): LiveTaste;

    IsLive(): boolean;
    /**
     * 配信範囲内にいるならtrue。
     */
    IsListened(audience: IAudience) : boolean;

    StartLive(): void;
    EndLive(): void;
}

/**
 * 進行するリスナーの機能。Listenerはプログラム上使うのでオーディエンス。
 */
export interface IAudience extends IPositionSettable<IAudience>{
    get OnLogin(): EventPort<(audience: IAudience) => void>;
    get OnSatisfactionUp(): EventPort<(audience: IAudience, score: number) => void>;
    get OnSubscribed(): EventPort<(audience: IAudience, score: number) => void>;
    get OnDisappointed(): EventPort<(audience: IAudience, score: number) => void>;
    get id(): number;
    get liveTaste(): LiveTaste;
    get maxSatisfaction(): number;
    /**
     * 画面上に存在しているか。(＝ログインしつつ、チャンネル登録していない)
     */
    IsExist(): boolean;
    Move(): void;
    ListenLive(): void;
    IsListenFinished(): boolean;
    AddSatisfaction(value: number): void;
    IsSatisfied(): boolean;
    DoSubscribe(): void;
    /**
     * 終了しているか。(チャンネル登録済or離脱、ログインは判定しない)
     */
    IsEnd(): boolean;
    Clone(): IAudience;
}

/**
 * ゲーム画面上の位置。
 */
export interface IPosition{
    get x(): number;
    get y(): number;
    /**
     * 指定した点との距離。
     */
    R(p: IPosition): number;
}

/**
 * 登録者数を管理する機能。
 */
export interface ISubscriber{
    get OnNowChanged(): EventPort<(count: number, delta: number) => void>;
    get now(): number;
    get delta(): number;
    get target(): number;
    Add(count: number): void;
    /**
     * 目標数を達成していたらtrue。
     */
    IsGoal(): boolean;
}

/**
 * 配信枠を表現する機能。
 */
export interface ILiveSpace{
    get OnSpaceStarted(): EventPort<(index: number, member: IMember) => void>;
    get OnSpaceStoped(): EventPort<(index: number, member: IMember) => void>;
    get max(): number;
    /**
     * 配信枠。配信枠上限までの配列で返し、配信枠が空の場合はnullとなる。
     */
    get space(): (IMember | null)[];
    SetMember(index: number, member: IMember | null): void;
}

/**
 * 位置を持つ機能。
 */
export interface IPositionSettable<T>{
    get OnPositionChanged(): EventPort<(data: T, position: IPosition) => void>;
    get position(): IPosition;
    SetPosition(position: IPosition): void;
}