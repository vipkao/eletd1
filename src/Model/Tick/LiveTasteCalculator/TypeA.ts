import { LiveTastePart } from "Model/Element/LiveTastePart";
import { ILiveTasteCalculator } from "../interfaces";

/**
 * 計算方法タイプＡ。
 * 単独：それぞれのgood/weakの最小値の合計。
 * コラボ：good/weakの各合計が大きい方を採用する。採用側は最大値、非採用側は0。人数分倍する。
 */
export class TypeA implements ILiveTasteCalculator{

    CalcSatisfaction(audience: LiveTastePart, member: LiveTastePart): number {
        const good = Math.min(audience.good, member.good);
        const weak = Math.min(audience.weak, member.weak);
        return good + weak;
    }

    CalcCollaboTaste(members: (LiveTastePart | null)[]): LiveTastePart {
        const name = members.filter((m): m is LiveTastePart => {
            if(!m) return false;
            return true;
        }).map(m => m.name)[0];

        const goods = members.map(m => {
            if(m === null) return 0;
            return m.good;
        });
        const goodsSum = goods.reduce((a, b) => a + b);

        const weaks = members.map(m => {
            if(m === null) return 0;
            return m.weak;
        });
        const weaksSum = weaks.reduce((a, b) => a + b);

        if(goodsSum >= weaksSum){
            const max = goods.reduce((a,b)=>Math.max(a,b)) * goods.length;
            return new LiveTastePart(name, max, 0);
        }else{
            const max = weaks.reduce((a,b)=>Math.max(a,b)) * weaks.length;
            return new LiveTastePart(name, 0, max);
        }
    }

}