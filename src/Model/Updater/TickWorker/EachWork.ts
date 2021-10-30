import { ITickWorker } from "../interfaces";


/**
 * コンストラクタで指定された各workerを順に実行する実装。
 */
export class EachWork implements ITickWorker{

    private readonly workers: ITickWorker[];

    constructor(
        workers: ITickWorker[]
    ){
        this.workers = workers;
    }

    Do(tick: number): void {
        for(const w of this.workers){
            w.Do(tick);
        }
    }

}