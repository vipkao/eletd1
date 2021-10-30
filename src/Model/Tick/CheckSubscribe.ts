import { ITickWorker } from "../Updater/interfaces";
import { Audiences } from "../Element/Audiences";

/**
 * リスナーが満足したか確認し、必要に応じてチャンネル登録させる。
 */
export class CheckSubscribe implements ITickWorker{

    private readonly audiences: Audiences;

    constructor(
        audiences: Audiences
    ){
        this.audiences = audiences;
    }

    Do(tick: number): void {
        this.audiences.exists.forEach(a => {
            if(!a.IsSatisfied()) return;
            a.DoSubscribe();
        });
    }

}