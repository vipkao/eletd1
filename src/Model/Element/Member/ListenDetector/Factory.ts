import { IListenDetector } from "../interfaces";
import { CircleArea } from "./CircleArea";

export class Factory{

    /**
     * 半径を指定して、円形状の配信エリアを作る。
     */
    static CreateFromRadius(
        radius: number
    ) : IListenDetector{
        const ret = new CircleArea(radius);
        return ret;
    }

}