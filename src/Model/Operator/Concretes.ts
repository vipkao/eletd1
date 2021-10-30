import { ILiveSpace } from "../Element/interfaces";
import { PresetMax } from "../Element/LiveSpace/PresetMax";

/**
 * Facadeの実装に必要な機能や値の一式。
 */
export class Concretes{

    public normalSpeedDelta: number;
    public highSpeedDelta: number;

    public liveSpace: ILiveSpace;
    public memberChangeLimit: number;

    constructor(
        memberChangeLimit: number,
        liveSpace: ILiveSpace
    ){
        this.normalSpeedDelta = 500;
        this.highSpeedDelta = 250;
        this.liveSpace = liveSpace;
        this.memberChangeLimit = memberChangeLimit;
    }

}