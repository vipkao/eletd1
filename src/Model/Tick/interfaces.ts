import { IAudience, IMember } from "../Element/interfaces";
import { LiveTastePart } from "../Element/LiveTastePart";

/**
 * 単独配信時の満足度を計算する機能。
 */
export interface ISingleSatisfiedCalculator{
    Calc(audience: IAudience, member: IMember): number;
}

/**
 * コラボ配信時の満足度を計算する機能。
 */
 export interface ICollaborationSatisfiedCalculator{
    Calc(audience: IAudience, members: IMember[]): number;
}

/**
 * LiveTasteを計算する機能。
 */
export interface ILiveTasteCalculator{
    CalcSatisfaction(audience: LiveTastePart, member: LiveTastePart): number;
    CalcCollaboTaste(members: (LiveTastePart | null)[]): LiveTastePart;
}