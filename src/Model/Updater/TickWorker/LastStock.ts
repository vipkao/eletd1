import { ITickWorker } from "../interfaces";

/**
 * 最後に指定されたtickを保存するだけの実装。
 * tickは参照できる。実行されていない場合は-1となる。
 */
export class LastStock implements ITickWorker{

    private _lastTick : number;

    get lastTick(){
        return this._lastTick;
    }

    constructor(){
        this._lastTick = -1;
    }

    Do(tick: number): void {
        this._lastTick = tick;
    }

}
