import { Preset } from "../../Position/Preset";
import { IMoveRoute } from "../interfaces";
import { PointToPoint } from "./ConditionedRoute/PointToPoint";
import { IConditionedRoute } from "./interfaces";
import { WithConditionBack } from "./WithConditionBack";

export class Factory{

    /**
     * [[x1, y1, startp1, speed1],[x2, y2, startp2, speed],…,[xn, yn, 0, 0]]
     */
    static CreateFromMultiPoint(config: number[][]): IMoveRoute{
        let sx = config[0][0];
        let sy = config[0][1];
        let target = config[0][2];
        let speed = config[0][3];
        const conditions : IConditionedRoute[] = [];
        for(const c of config.slice(1)){
            const nx = c[0];
            const ny = c[1];

            const cond = new PointToPoint(
                target,
                new Preset(sx, sy),
                new Preset(nx, ny),
                speed
            );
            
            conditions.push(cond);

            sx = nx;
            sy = ny;
            target = c[2];
            speed = c[3];
        }
        const ret = new WithConditionBack(
            ... conditions
        );
        return ret;
    }
}