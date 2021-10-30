import { LiveTastePart } from "./LiveTastePart";

/**
 * 配信内容性向。リスナーの場合は、配信内容趣向。
 */
 export class LiveTaste{

    private readonly parts: LiveTastePart[];
    get all(): LiveTastePart[]{
        return this.parts.concat();
    }

    constructor(
        parts: LiveTastePart[]
    ){
        this.parts = parts;
    }

    GetPart(name: string): LiveTastePart | null{
        const ret = this.parts.filter(p => p.name === name);

        if(ret.length === 0) return null;

        return ret[0];
    }

    /**
     * ８項目セットの配信内容性向を作る。
     * @param config [[good,weak],[good,weak],…]順番は上記の通り
     */
    static CreateTypeA(
        config: number[][]
    ){
        const names = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const parts = names.map((name, i) => {
            const good = config[i][0];
            const weak = config[i][1];
            return new LiveTastePart(name, good, weak);
        });
        const ret = new LiveTaste(parts);
        return ret;
    }

}