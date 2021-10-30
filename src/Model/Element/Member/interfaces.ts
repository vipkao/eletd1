import { IPosition } from "../interfaces";

/**
 * リスナーが視聴しているかを判定する機能。
 */
export interface IListenDetector{
    IsListen(audience: IPosition, member: IPosition): boolean;
}