import { IMillisecondServer } from "../interfaces";

/**
 * 停止中はserveの数字が進まない実装。再開した時に一気に進む。
 */
export class Stoppable implements IMillisecondServer{

    private readonly source: IMillisecondServer;

    private lastServe: number;

    private isStop: boolean;

    constructor(
        isDefaultStop: boolean,
        source: IMillisecondServer
    ){
        this.isStop = isDefaultStop;
        this.source = source;
        this.lastServe = 0;
    }


    Serve(): number {
        if(this.isStop) return this.lastServe;

        this.lastServe = this.source.Serve();
        return this.lastServe;
    }

    Stop(): void{
        this.isStop = true;
    }

    Resume(): void{
        this.isStop = false;
    }    
}