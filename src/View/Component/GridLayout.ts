import { IPosition } from "Model/Element/interfaces";
import { Preset } from "Model/Element/Position/Preset";

export type GridDirection = "horizontal" | "vertical";

export class GridLayout{
    
    private readonly direction: GridDirection;
    private readonly limit: number;
    private readonly width: number;
    private readonly height: number;
    private readonly offsetX: number;
    private readonly offsetY: number;
    private readonly margin: number;

    constructor(
        direction: GridDirection,
        limit: number,
        width: number,
        height: number,
        offsetX: number,
        offsetY: number,
        margin: number
    ){
        this.direction = direction;
        this.limit = limit;
        this.width = width;
        this.height = height;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.margin = margin;
    }

    Layout(count: number): IPosition{
        if(this.direction === "horizontal"){
            const x = (count % this.limit) * (this.width + this.margin) + this.offsetX + this.margin;
            const y = Math.floor(count / this.limit) * (this.height + this.margin) + this.offsetY + this.margin;
            return new Preset(x, y);
        }
        if(this.direction === "vertical"){
            const x = Math.floor(count / this.limit) * (this.width + this.margin) + this.offsetX + this.margin;
            const y = (count % this.limit) * (this.height + this.margin) + this.offsetY + this.margin;
            return new Preset(x, y);
        }
        throw new Error("要対応:"+this.direction);
    }


}