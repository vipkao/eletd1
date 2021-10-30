import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { Button } from "../Component/Button";
import { FormatLabel } from "../Component/FormatLabel";
import { Image } from "../Component/Image";
import { Layer } from "../Component/Layer";
import { Wrapper } from "../Component/Wrapper";
import { IGameLayer } from "../interfaces";

/**
 * 全面にメッセージを出すだけの実装。
 */
export class MessageOk implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onOk : EventPort<() => void>;
    get OnOk(): EventPort<() => void>{
        return this._onOk;
    }

    private readonly model: Model;

    private readonly layer: Layer;
    private readonly wrapper: Wrapper;
    readonly text: FormatLabel;
    private readonly okImage: Image;
    private readonly okButton: Button<void>;

    constructor(
        model: Model,
        okImageKey: string
    ){
        this.event = new EventEmitter();
        this._onOk = new EventPort("OnOk", this.event);

        this.model = model;

        this.layer = new Layer();
        this.wrapper = new Wrapper(this.layer, 0, 0, 1200, 800, 0x000022, 0.5);
        this.text = new FormatLabel(this.layer, 0, 0);
        this.okImage = new Image(this.layer, 450, 500, 300, 200, okImageKey);
        this.okButton = new Button(
            this.layer, 450, 500, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.okButton.OnTweenEnd.on(() => {
            this.layer.Setting(l => l.setVisible(false));
            this.event.emit(this._onOk);
        });
    }


    SetScene(scene: Phaser.Scene): void {
        this.layer.SetScene(scene).Setting(l => l.setVisible(false));
        this.wrapper.SetScene(scene).Setting(r => r.setInteractive());
        this.text.SetScene(scene);
        this.okImage.SetScene(scene);
        this.okButton.SetScene(scene).SetEnable(true);
    }

    Show(x: number, y: number, text:string): MessageOk{
        this.text.SetFormat("{0}").SetValues(text).SetPosition(x, y).Show();
        this.layer.Setting(l => l.setVisible(true));
        return this;
    }

    Destory(): void{
        this._onOk.removeAllListeners();
        this.wrapper.Destory();
        this.text.Destory();
        this.okImage.Destory();
        this.okButton.Destory();
        this.layer.Destory();
    }

}