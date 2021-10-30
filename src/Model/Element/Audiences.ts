import { IAudience, ISubscriber } from "./interfaces";

/**
 * リスナーの集合体。
 */
export class Audiences{

    private readonly audiences : IAudience[];
    get all(): IAudience[]{
        return this.audiences;
    }

    constructor(
        audiences : IAudience[]
    ){
        this.audiences = audiences;
    }

    MoveAll(): void {
        for(const a of this.audiences){
            a.Move();
        }
    }

    get exists(): IAudience[]{
        const ret = this.audiences.filter(a => a.IsExist());
        return ret;
    }

    IsEnd(): boolean{
        const ret = this.audiences.every(a => a.IsEnd());
        return ret;
    }

    ForEach(action: (audience : IAudience) => void): void{
        for(const a of this.audiences){
            action(a);
        }
    }

}