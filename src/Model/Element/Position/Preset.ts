import { IPosition } from "../interfaces";

/**
 * イミュータブルな実装。
 */
export class Preset implements IPosition{
    constructor(x: number, y: number){
        this._x = x;
        this._y = y;
    }
    private _x: number;
    private _y: number;
    get x(): number { return this._x; }
    get y(): number { return this._y; }

    R(p: IPosition): number {
        const r = Math.sqrt(Math.pow(this.x - p.x, 2)+Math.pow(this.y - p.y, 2));
        return r;
    }


    public toString(): string{
        return `[${this._x},${this._y}]`;
    }

}