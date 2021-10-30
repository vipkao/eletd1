import { ITickWorker } from "../interfaces";

/**
 * 一時停止可能な実装。停止中はworkerは実行されない。
 * tickが進んでしまうので、一旦非推奨。
 */
export class Stoppable implements ITickWorker{

    private isStop: boolean;
    private readonly worker: ITickWorker;

    constructor(
        isDefaultStop: boolean,
        worker: ITickWorker
    ){
        this.isStop = isDefaultStop;
        this.worker = worker;
    }

    Do(tick: number): void {
        if(this.isStop) return;
        this.worker.Do(tick);
    }

    Stop(): void{
        this.isStop = true;
    }

    Resume(): void{
        this.isStop = false;
    }


}