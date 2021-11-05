import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { Button } from "../Component/Button";
import { FormatLabel } from "../Component/FormatLabel";
import { Layer } from "../Component/Layer";
import { Image } from "../Component/Image";
import { IGameLayer } from "../interfaces";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";

/**
 * タイトル画面。
 */
export class Title implements IGameLayer{

    private readonly event : EventEmitter;

    private readonly _onHelp : EventPort<() => void>;
    get OnHelp(): EventPort<() => void>{
        return this._onHelp;
    }
    
    private readonly _onClosed : EventPort<() => void>;
    get OnClosed(): EventPort<() => void>{
        return this._onClosed;
    }

    private readonly layer: Layer;
    private readonly image: Image;
    private readonly startButtonImage: Image;
    private readonly startButton: Button<void>;
    private readonly helpButton: Button<void>;
    private readonly version: FormatLabel;

    private readonly versionString: string;

    constructor(
        backgroundImageKey: string,
        buttonImageKey: string,
        versionString: string,
    ){
        this.event = new EventEmitter();
        this._onHelp = new EventPort("OnHelp", this.event);
        this._onClosed = new EventPort("OnClosed", this.event);

        this.layer = new Layer();
        this.image = new Image(
            this.layer, 0, 0, 1200, 800, backgroundImageKey
        );
        this.startButtonImage = new Image(
            this.layer, 450, 400, 300, 200, buttonImageKey
        );
        this.startButton = new Button<void>(
            this.layer,
            450, 400, 300, 200, 
            undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 0),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.helpButton = new Button<void>(
            this.layer,
            1100, 700, 100, 100, 
            undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 0),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.version = new FormatLabel(
            this.layer, 0, 780
        ).SetFormat("{0}");
        this.versionString = versionString;

        this.startButton.OnTweenEnd.on(_ => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            //TODO フェードでも入れる？
            this.event.emit(this._onClosed);
        });

        this.helpButton.OnTweenEnd.on(_ => {
            this.event.emit(this._onHelp);
        });
    }


    SetScene(scene: Phaser.Scene): void{
        this.layer.SetScene(scene);

        this.image.SetScene(scene);
        
        this.startButtonImage.SetScene(scene);
        this.startButton.SetScene(scene);
        this.helpButton.SetScene(scene);
        this.version.SetScene(scene)
            .Setting(t => t.setFontSize(20).setColor("#666666"))
            .SetValues(this.versionString).Show();

    }

    Destory(): void{
        this._onClosed.removeAllListeners();
        this._onHelp.removeAllListeners();
        this.image.Destory();
        this.startButtonImage.Destory();
        this.startButton.Destory();
        this.helpButton.Destory();
        this.layer.Destory();
    }

}