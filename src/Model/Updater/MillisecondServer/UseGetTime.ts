import { IMillisecondServer } from "../interfaces";

/**
 * Date.getTimeを使用した実装。
 */
export class UseGetTime implements IMillisecondServer{

    private readonly now: Date;

    constructor(){
        this.now = new Date();
    }

    Serve(): number {
        const ret = Date.now();
        return ret;
    }

}