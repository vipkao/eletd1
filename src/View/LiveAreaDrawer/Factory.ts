import { ILiveAreaDrawer } from "../interfaces";
import { Circle } from "./Circle";

export type AreaType = "c" | "r";
export class Factory{
    static CreateFromAreaType(
        type: AreaType, value: number[]
    ): ILiveAreaDrawer{
        if(type === "c"){
            return new Circle(value[0]);
        }
        if(type === "r"){
            throw new Error("未実装");
        }
        throw new Error("未対応"+type);
    }
}