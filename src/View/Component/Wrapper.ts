import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { IGameLayer } from "../interfaces";
import { Layer } from "./Layer";

/**
 * クリックを拾ったり、単色背景を作る実装。
 */
export class Wrapper implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onDown : EventPort<(x: number, y: number) => void>;
    get OnDown(): EventPort<(x: number, y: number) => void>{
        return this._onDown;
    }

    private readonly layer: Layer;

    private scene: Phaser.Scene | null = null;
    private phaserRectangle : Phaser.GameObjects.Rectangle | null = null;

    private readonly x: number;
    private readonly y: number;
    private readonly width: number;
    private readonly height: number;
    private readonly color: number;
    private readonly alpha: number;

    constructor(
        layer: Layer,
        x: number, y:number,
        width: number, height: number,
        color: number, alpha: number
    ){
        this.event = new EventEmitter();
        this._onDown = new EventPort("OnDown", this.event);

        this.layer = layer;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alpha = alpha;
    }

    SetScene(scene: Phaser.Scene): Wrapper{
        this.scene = scene;
        if(this.phaserRectangle === null){
            this.phaserRectangle = this.Build();
        }
        return this;
    }

    Setting(callback: (rectangle: Phaser.GameObjects.Rectangle) => void): Wrapper{
        if(this.phaserRectangle === null){
            this.phaserRectangle = this.Build();
        }
        callback(this.phaserRectangle);
        return this;
    }

    Destory(): void{
        this._onDown.removeAllListeners();
        this.phaserRectangle?.destroy(true);
    }

    private Build(): Phaser.GameObjects.Rectangle{
        if(this.scene === null) throw new Error("scene not set");
        const ret = new Phaser.GameObjects.Rectangle(
            this.scene,
            this.x + this.width/2, this.y + this.height/2,
            this.width, this.height,
            this.color, this.alpha
        ).setVisible(true);
        this.layer.Setting(l => l.add(ret));
        ret.on("pointerdown", (p: { x: number; y: number; }) => {
            this.event.emit(this._onDown, p.x, p.y);
        });
        return ret;
    }

}