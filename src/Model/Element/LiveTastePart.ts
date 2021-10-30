/**
 * 配信内容性向の１項目。
 */
export class LiveTastePart{

    public readonly name: string;
    public readonly good: number;
    public readonly weak: number;

    constructor(
        name: string,
        good: number,
        weak: number
    ){
        this.name = name;
        this.good = good;
        this.weak = weak;
    }

}