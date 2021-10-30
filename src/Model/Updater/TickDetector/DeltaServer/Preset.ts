import { IDeltaServer } from "../interfaces";

/**
 * 指定した値をミリ秒の差として返す実装。
 */
export class Preset implements IDeltaServer{

    public delta : number;

    constructor(){
        this.delta = 0;
    }

    Serve(): number {
        return this.delta;
    }

}