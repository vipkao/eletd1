import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { Button } from "../Component/Button";
import { FormatLabel } from "../Component/FormatLabel";
import { Layer } from "../Component/Layer";
import { IGameLayer } from "../interfaces";
import { Image } from "../Component/Image";
import { Wrapper } from "../Component/Wrapper";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";

/**
 * ステージ開始の画面。
 */
export class StageStart implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onStart : EventPort<() => void>;
    get OnStart(): EventPort<() => void>{
        return this._onStart;
    }

    private readonly model: Model;

    private readonly layer: Layer;
    private readonly background: Wrapper;
    private readonly startButton: Button<void>;
    private readonly titleImage: Image;
    private readonly captionImage: Image;
    private readonly buttonImage: Image;
    private readonly titleText: FormatLabel;
    private readonly captionText: FormatLabel;

    constructor(
        model: Model,
        title: string, caption: string,
        titleImageKey: string,
        captionImageKey: string,
        buttonImageKey: string
    ){
        this.event = new EventEmitter();
        this._onStart = new EventPort("OnStart", this.event);

        this.model = model;

        this.layer = new Layer();
        this.background = new Wrapper(
            this.layer,
            0, 0, 1200, 800, 0xFFFFFF, 0.8
        );
        this.titleImage = new Image(
            this.layer,
            200, 100, 800, 150, titleImageKey
        );
        this.captionImage = new Image(
            this.layer,
            150, 250, 900, 300, captionImageKey
        );
        this.buttonImage = new Image(
            this.layer,
            450, 500, 300, 200, buttonImageKey
        );
        this.startButton = new Button<void>(
            this.layer,
            450, 500, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 0),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.startButton.OnTweenEnd.on(() => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            this.event.emit(this._onStart);
        });
        this.titleText = new FormatLabel(
            this.layer,
            220, 120
        ).SetFormat("{0}").SetValues(title);
        this.captionText = new FormatLabel(
            this.layer,
            170, 270
        ).SetFormat("{0}").SetValues(caption);

    }


    SetScene(scene: Phaser.Scene): void{
        
        this.layer.SetScene(scene);
        
        //下層にクリックを検出させないようにする。
        this.background.SetScene(scene).Setting(r => r.setInteractive());

        this.titleImage.SetScene(scene);
        this.captionImage.SetScene(scene);
        this.buttonImage.SetScene(scene);
        this.startButton.SetScene(scene);
        this.titleText.SetScene(scene)
            .Setting(t => t.setFontSize(60).setColor("#333366").setShadow(2, 2, "#666699", 4).setPadding(4)).Show();
        this.captionText.SetScene(scene)
            .Setting(t => t.setFontSize(40).setColor("#333366").setShadow(2, 2, "#666699", 4).setPadding(4)).Show();

    }

    Destory(): void{
        this._onStart.removeAllListeners();
        this.background.Destory();
        this.titleImage.Destory();
        this.captionImage.Destory();
        this.buttonImage.Destory();
        this.startButton.Destory();
        this.titleText.Destory();
        this.captionText.Destory();
        this.layer.Destory();
    }

}