import { ILiveAreaDrawer } from "../interfaces";

/**
 * メンバーを中心とした円を描画する。
 */
export class Circle implements ILiveAreaDrawer{

    private readonly radius: number;

    constructor(
        radius: number
    ){
        this.radius = radius;
    }

    Fill(x: number, y:number, graphics: Phaser.GameObjects.Graphics): Phaser.GameObjects.Graphics {
        graphics.fillCircle(x, y, this.radius);
        return graphics;
    }

    Stroke(x: number, y:number, graphics: Phaser.GameObjects.Graphics): Phaser.GameObjects.Graphics {
        graphics.strokeCircle(x, y, this.radius);
        return graphics;
    }

}