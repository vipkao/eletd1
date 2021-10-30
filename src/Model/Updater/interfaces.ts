/**
 * ミリ秒を提供する機能。
 */
export interface IMillisecondServer{
    Serve() : number
}

/**
 * 指定されたミリ秒からtickの処理が必要か判定する機能。
 */
export interface ITickDetector{
    NeedWork(millisecond : number) : boolean;
}

/**
 * tick毎に実行される処理。
 */
export interface ITickWorker{
    /**
     * @param tick 現在のtick。0からの連番。
     */
    Do(tick : number) : void;
}
