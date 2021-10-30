import { IPosition } from "../interfaces";

/**
 * 視聴者が移動する経路を計算する機能。
 */
export interface IMoveRoute{
    Calc(p: number): IPosition;
}