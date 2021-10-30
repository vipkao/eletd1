import { ITickWorker } from "../Updater/interfaces";
import { Audiences } from "../Element/Audiences";

/**
 * リスナーを移動させる実装。
 */
export class MoveAudiences implements ITickWorker{

    private readonly audiences : Audiences;

    constructor(
        audiences : Audiences
    ){
        this.audiences = audiences;
    }

    Do(tick: number): void {
        this.audiences.MoveAll();
    }

}