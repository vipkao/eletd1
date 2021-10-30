import { IPosition } from "../../interfaces";
import { IListenDetector } from "../interfaces";

/**
 * メンバーを中心とした円形を配信エリアとする実装。
 */
export class CircleArea implements IListenDetector{
    
    private readonly radius: number;

    constructor(radius: number){
        this.radius = radius;    
    }
    
    IsListen(audience: IPosition, member: IPosition): boolean {
        const r = audience.R(member);
        if(r <= this.radius)
            return true;
        return false;
    }

}