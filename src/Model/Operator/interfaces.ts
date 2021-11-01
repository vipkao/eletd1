import { IMember, IPosition } from "../Element/interfaces";
import { SaveData } from "../Element/SaveData";
import { EventPort } from "../Utils/EventEmitter";

export type SpeedType = "normal" | "high" | "max";

/**
 * speedChangerによる変更を、deltaの変更イベントとして通知する機能。
 */
export interface ISpeedChanger{
    /**
     * isStopedがtrueの場合は常にNumber.MAX_VALUEになる。
     */
    get OnDeltaChanged(): EventPort<(delta: number) => void>;
    get nowDelta(): number;
    get nowSpeed(): SpeedType;
    get isStopped(): boolean;
    ChangeNext(): void;
    StopOrResume(): void;
}

/**
 * 配信メンバーの操作に関する機能。
 */
export interface IMemberChanger{
    /**
     * 配信メンバーを入れ替える。
     * @param index ILiveSapceの配信枠を指定するindex。
     * @param newMember 
     * @param position 
     */
    ChangeMember(index: number, newMember: IMember, position: IPosition): void;
    ExitMember(index: number): void;
    get OnRemainingChanged(): EventPort<(remaining: number) => void>;
    /**
     * 残り変更可能回数。
     */
     get remaining(): number;
}

/**
 * 次ステージへの進行に関する機能。
 */
export interface IStageNexter{
    get OnNext(): EventPort<(saveData: SaveData) => void>;
    get OnRetry(): EventPort<(saveData: SaveData) => void>;
    get OnTitle(): EventPort<(saveData: SaveData) => void>;
    Next(): void;
    Retry(): void;
    Title(): void;
}