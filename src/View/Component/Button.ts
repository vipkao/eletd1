import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { IGameLayer } from "../interfaces";
import { IClickDetector, IFlasher, IHighlighter } from "./interfaces";
import { Layer } from "./Layer";

/**
 * ボタン。
 */
export class Button<T> implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onDown : EventPort<(data: T) => void>;
    get OnDown(): EventPort<(data: T) => void>{
        return this._onDown;
    }
    private readonly _onTweenEnd : EventPort<(data: T) => void>;
    get OnTweenEnd(): EventPort<(data: T) => void>{
        return this._onTweenEnd;
    }

    private readonly layer: Layer;

    private scene: Phaser.Scene | null = null;
    private phaserContainer : Phaser.GameObjects.Container | null = null;
    private readonly highlighter: IHighlighter;
    private readonly flasher: IFlasher;
    private readonly clickDetector: IClickDetector;

    private readonly x: number;
    private readonly y: number;
    private readonly width: number;
    private readonly height: number;
    private readonly data: T;

    private enable: boolean = true;

    public toStringName: string = "";

    constructor(
        layer: Layer,
        x: number, y:number,
        width: number, height: number,
        data: T,
        highlighter: IHighlighter,
        flasher: IFlasher,
        clickDetector: IClickDetector
    ){
        this.event = new EventEmitter();
        this._onDown = new EventPort("OnDown", this.event);
        this._onTweenEnd = new EventPort("OnTweenEnd", this.event);

        this.layer = layer;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.data = data;

        this.highlighter = highlighter;
        this.flasher = flasher;
        this.clickDetector = clickDetector;
    }

    SetScene(scene: Phaser.Scene): Button<T>{
        this.scene = scene;
        if(this.phaserContainer === null){
            this.phaserContainer = this.Build();
        }
        return this;
    }

    SetEnable(enable : boolean): Button<T>{
        this.enable = enable;
        if(enable){
            this.highlighter.Start();
        }else{
            this.highlighter.Stop();
        }
        return this;
    }

    Setting(callback: (text: Phaser.GameObjects.Container) => void): Button<T>{
        if(this.phaserContainer === null){
            this.phaserContainer = this.Build();
        }
        callback(this.phaserContainer);
        return this;
    }

    Destory(): void{
        this._onDown.removeAllListeners();
        this._onTweenEnd.removeAllListeners();
        this.highlighter.Destory();
        this.flasher.Destory();
        this.clickDetector.Destory();
        this.phaserContainer?.destroy(true);
    }
    

    private Build(): Phaser.GameObjects.Container{
        if(this.scene === null) throw new Error("scene not set");
        const button = new Phaser.GameObjects.Container(
            this.scene, this.x + this.width / 2, this.y + this.height / 2
        ).setSize(this.width, this.height).setInteractive();

        this.highlighter.SetScene(this.scene, button);
        this.flasher.SetScene(this.scene, button);

        if(!this.enable){
            this.highlighter.Stop();
        }

        this.layer.Setting(l => l.add(button));

        button.on('pointerdown', () => {
            if(!this.enable) return;
            this.clickDetector.Down(0, 0);
        });
        this.clickDetector.OnClicked.on(() => {
            this.highlighter.Stop();
            this.flasher.Start();
            this.event.emit(this._onDown, this.data);
        });
        this.flasher.OnFlashEnded.on(() => {
            this.event.emit(this._onTweenEnd, this.data);
            if(this.enable) this.highlighter.Start();
        });

        return button;
    }

    public toString(): string{
        const e = this.enable ? "o": "-";
        return `[Button[${this.toStringName}]:${this.layer}:(${this.x},${this.y}):[${e}]]`;
    }

}