import { IAudience, IMember } from "Model/Element/interfaces";
import { ILiveTasteCalculator, ISingleSatisfiedCalculator } from "../interfaces";

export class ByCalculator implements ISingleSatisfiedCalculator {

    private readonly calculator: ILiveTasteCalculator;

    constructor(
        calculator: ILiveTasteCalculator
    ) {       
        this.calculator = calculator;
    }

    Calc(_audience: IAudience, _member: IMember): number {
        const audience = _audience.liveTaste;
        const member = _member.liveTaste;

        const ret = audience.all.map(a => {
            const m = member.GetPart(a.name);

            if(m === null) return 0;

            const ret = this.calculator.CalcSatisfaction(a, m);
            return ret;
        }).reduce((a, b) => a + b);

        return ret;
    }

}