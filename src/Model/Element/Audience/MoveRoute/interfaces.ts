import { IMoveRoute } from "../interfaces";

/**
 * 条件付きルート。
 */
export interface IConditionedRoute extends IMoveRoute{
    IsTarget(p: number): boolean;
}