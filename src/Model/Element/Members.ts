import { IMember } from "./interfaces";

/**
 * メンバーの集合体。
 */
export class Members{

    private readonly members : IMember[];
    get all(): IMember[]{
        return this.members.concat();
    }

    /**
     * 配信していないメンバー一覧。
     */
    get rests(): IMember[]{
        const ret = this.members.filter(m => !m.IsLive());
        return ret;
    }

    constructor(
        members : IMember[]
    ){
        this.members = members;
    }

    ForEach(action: (member : IMember) => void): void{
        for(const m of this.members){
            action(m);
        }
    }


}