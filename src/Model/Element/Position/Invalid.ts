import { IPosition } from "../interfaces";

/**
 * 無効な位置。位置を取得するとエラーになる。
 */
export class Invalid implements IPosition{
    R(p: IPosition): number {
        throw new Error("Method not implemented.");
    }
    get x(): number {
        throw new Error("invalid position");
    }
    get y(): number {
        throw new Error("invalid position");
    }

    public toString(): string{
        return '[-,-]';
    }

}