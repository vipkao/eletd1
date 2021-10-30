import { IPosition } from "Model/Element/interfaces";
import { Preset } from "Model/Element/Position/Preset";
import { IConditionedRoute } from "../interfaces";

/**
 * 指定した方向に等速移動する実装。
 */
export class PointToPoint implements IConditionedRoute{

    private readonly target: number;
    private readonly start: IPosition;
    private readonly direction: IPosition;
    private readonly xd: number;
    private readonly yd: number;
    private readonly speed: number;

    /**
     * @param target pがこの値になったらIsTargetがtrueになる。
     * @param start 始点。
     * @param direction 進む方向。終点ではない。 
     * @param speed pが1増える時に、direction方向に移動する量。
     */
    constructor(
        target: number,
        start: IPosition,
        direction: IPosition,
        speed: number,
    ){
        this.target = target;
        this.start = start;
        this.speed = speed;
        this.direction = direction;
        const r = start.R(direction);
        //100は小数点の誤差対策。あまり意味ないか？
        this.xd = (direction.x - start.x) * 100 / r;
        this.yd = (direction.y - start.y) * 100 / r;
    }

    IsTarget(p: number): boolean {
        if(p >= this.target)
            return true;
        return false;
    }
    Calc(p: number): IPosition {
        const x = this.start.x + this.xd * (p - this.target) * this.speed / 100;
        const y = this.start.y + this.yd * (p - this.target) * this.speed / 100;
        const ret = new Preset(x, y);
        return ret;
    }

    toString(): string{
        return `[PtP:${this.target},${this.start},${this.direction},${this.speed}]`;
    }

}