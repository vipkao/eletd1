import { IMillisecondServer } from "../interfaces";

/**
 * 指定したミリ秒を返す実装。
 */
export class Preset implements IMillisecondServer{

    public millisecond : number;

    constructor(){
        this.millisecond = 0;
    }

    Serve(): number {
        return this.millisecond;
    }

}