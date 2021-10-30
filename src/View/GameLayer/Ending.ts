import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { Button } from "../Component/Button";
import { Layer } from "../Component/Layer";
import { Image } from "../Component/Image";
import { IGameLayer } from "../interfaces";
import { FormatLabel } from "../Component/FormatLabel";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";

/**
 * エンディング画面。
 */
export class Ending implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onClosed : EventPort<() => void>;
    get OnClosed(): EventPort<() => void>{
        return this._onClosed;
    }

    private readonly subscriber: number;

    private readonly layer: Layer;
    private readonly image: Image;
    private readonly subscriberText: FormatLabel;
    private readonly startButton: Button<void>;

    constructor(
        subscriber: number,
        backgroundImageKey: string
    ){
        this.event = new EventEmitter();
        this._onClosed = new EventPort("OnClosed", this.event);

        this.subscriber = subscriber;

        this.layer = new Layer();
        this.image = new Image(
            this.layer, 0, 0, 1200, 800, backgroundImageKey
        );
        this.subscriberText = new FormatLabel(
            this.layer, 800, 800
        )
        this.startButton = new Button<void>(
            this.layer,
            450, 500, 300, 200, undefined,
            new RectangleBreath(0xFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );

        this.startButton.OnTweenEnd.on(_ => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            //TODO フェードでも入れる？
            this.event.emit(this._onClosed);
        });
    }


    SetScene(scene: Phaser.Scene): void{
        this.layer.SetScene(scene);

        this.image.SetScene(scene);

        this.subscriberText.SetScene(scene)
            .Setting(t => t.setColor("#000033").setPadding(4).setFontSize(35).setShadow(2, 2, "#666699", 4))
            .SetFormat("登録者数：{0}人").SetValues(this.subscriber);

        this.startButton.SetScene(scene);
    }

    Destory(): void{
        this._onClosed.removeAllListeners();
        this.image.Destory();
        this.subscriberText.Destory();
        this.startButton.Destory();
        this.layer.Destory();
    }

}