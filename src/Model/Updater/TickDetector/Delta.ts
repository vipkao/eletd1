import { ITickDetector } from "../interfaces";
import { IDeltaServer } from "./interfaces";

/**
 * 前回のミリ秒に対する差が、deltaServerの返す値以上となった時にtrueとなる実装。
 * trueになったタイミングで、前回のミリ秒が更新される。
 */
export class Delta implements ITickDetector{

    private deltaServer : IDeltaServer;
    private prev : number;

    constructor(
        deltaServer : IDeltaServer
    ){
        this.deltaServer = deltaServer;
        this.prev = 0;
    }

    NeedWork(millisecond: number): boolean {
        const delta = this.deltaServer.Serve();
        if(millisecond - this.prev >= delta){
            this.prev = millisecond;
            return true;
        }

        return false;
    }

}
