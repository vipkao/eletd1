import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { Layer } from "../Component/Layer";
import { IGameLayer } from "../interfaces";
import { Button } from "../Component/Button";
import { Wrapper } from "../Component/Wrapper";
import { Image } from "../Component/Image";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";

/**
 * ステージ終了した時の画面。
 */
export class StageEnd implements IGameLayer{

    private readonly event : EventEmitter;
    private readonly _onNext : EventPort<() => void>;
    get OnNext(): EventPort<() => void>{ return this._onNext; }
    private readonly _onRetry : EventPort<() => void>;
    get OnRetry(): EventPort<() => void>{ return this._onRetry; }
    private readonly _onTitle : EventPort<() => void>;
    get OnTitle(): EventPort<() => void>{ return this._onTitle; }

    private readonly model: Model;

    protected readonly layer: Layer;
    private readonly background: Wrapper;
    private readonly headerImage: Image;
    private readonly retryImage: Image;
    private readonly nextImage: Image;
    private readonly titleImage: Image;
    private readonly retryButton: Button<void>;
    private readonly nextButton: Button<void>;
    private readonly titleButton: Button<void>;

    private readonly setSceneCallback: (scene: Phaser.Scene) => void;

    constructor(
        model: Model,
        headerImageKey: string,
        nextImageKey: string,
        retryImageKey: string,
        titleImageKey: string,
        setSceneCallback: (scene: Phaser.Scene) => void
    ){
        this.event = new EventEmitter();
        this._onNext = new EventPort("OnNext", this.event);
        this._onRetry = new EventPort("OnRetry", this.event);
        this._onTitle = new EventPort("OnTitle", this.event);

        this.model = model;

        this.layer = new Layer();
        this.background = new Wrapper(
            this.layer,
            0, 0, 1200, 800, 0xEEEEFF, 0.5
        );
        this.headerImage = new Image(
            this.layer,
            0, 0, 1200, 300, headerImageKey
        );
        this.nextImage = new Image(
            this.layer,
            290, 300, 300, 200, nextImageKey
        );
        this.retryImage = new Image(
            this.layer,
            610, 300, 300, 200, retryImageKey
        );
        this.titleImage = new Image(
            this.layer,
            450, 550, 300, 200, titleImageKey
        );
        this.nextButton = new Button<void>(
            this.layer,
            290, 300, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.retryButton = new Button<void>(
            this.layer,
            610, 300, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.titleButton = new Button<void>(
            this.layer,
            450, 550, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );

        this.retryButton.OnTweenEnd.on(_ => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            this.event.emit(this._onRetry);
        });
        this.nextButton.OnTweenEnd.on(_ => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            this.event.emit(this._onNext);
        });
        this.titleButton.OnTweenEnd.on(_ => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            this.event.emit(this._onTitle);
        });

        this.setSceneCallback = setSceneCallback;
    }


    SetScene(scene: Phaser.Scene): void{        
        //初期非表示
        this.layer.SetScene(scene).Setting(l => l.setVisible(false).setActive(false));

        //下層にクリックを検出させないようにする。
        this.background.SetScene(scene).Setting(r => r.setInteractive());

        this.headerImage.SetScene(scene).Setting(i => i.setVisible(true));
        this.nextImage.SetScene(scene).Setting(i => i.setVisible(true));
        this.retryImage.SetScene(scene).Setting(i => i.setVisible(true));
        this.titleImage.SetScene(scene).Setting(i => i.setVisible(true));

        this.nextButton.SetScene(scene);
        this.retryButton.SetScene(scene);
        this.titleButton.SetScene(scene);

        this.setSceneCallback(scene);

    }

    Show(): void{
        this.layer.Setting(l => l.setVisible(true).setActive(true));
    }

    Destory(): void{
        this._onNext.removeAllListeners();
        this._onRetry.removeAllListeners();
        this._onTitle.removeAllListeners();
        this.background.Destory();
        this.headerImage.Destory();
        this.nextImage.Destory();
        this.retryImage.Destory();
        this.titleImage.Destory();
        this.nextButton.Destory();
        this.retryButton.Destory();
        this.titleButton.Destory();
        this.layer.Destory();        
    }

}