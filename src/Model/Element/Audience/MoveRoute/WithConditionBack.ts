import { IPosition } from "../../interfaces";
import { IMoveRoute } from "../interfaces";
import { IConditionedRoute } from "./interfaces";

/**
 * 複数の条件付きルートによる実装。条件は指定された順の後方から判定する。
 */
export class WithConditionBack implements IMoveRoute{

    private readonly routes: IConditionedRoute[];

    constructor(... routes: IConditionedRoute[]){
        this.routes = routes.reverse();
    }

    Calc(p: number): IPosition {
        for(const route of this.routes){
            if(!route.IsTarget(p)) continue;
            const ret = route.Calc(p);
            return ret;
        }
        throw new Error("no match:"+p);
    }

    toString(): string{
        const c = this.routes.map(r => r.toString()).reduce((a,b)=>a+","+b);
        return `[WCB:${c}]`;
    }

}