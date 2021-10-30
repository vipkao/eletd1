import { IAudience, IMember } from "Model/Element/interfaces";
import { ICollaborationSatisfiedCalculator, ILiveTasteCalculator } from "../interfaces";

export class ByCalculator implements ICollaborationSatisfiedCalculator {

    private readonly calculator: ILiveTasteCalculator;

    constructor(
        calculator: ILiveTasteCalculator
    ) {       
        this.calculator = calculator;
    }
    
    Calc(_audience: IAudience, _members: IMember[]): number {
        const audience = _audience.liveTaste;

        const ret = audience.all.map(a => {
            const ms = _members
                .map(m => m.liveTaste.GetPart(a.name))
                .filter(m => m !== null);
            const c = this.calculator.CalcCollaboTaste(ms);
            const ret = this.calculator.CalcSatisfaction(a, c);
            return ret;
        }).reduce((a, b) => a + b);

        return ret;
    }
}