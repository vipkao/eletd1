import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { Button } from "../Component/Button";
import { Image } from "../Component/Image";
import { Layer } from "../Component/Layer";
import { Wrapper } from "../Component/Wrapper";
import { IGameLayer } from "../interfaces";

/**
 * ヘルプ画面。
 */
export class Help implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onClose : EventPort<() => void>;
    get OnClose(): EventPort<() => void>{
        return this._onClose;
    }

    private readonly layer: Layer;

    private readonly wrapper: Wrapper;
    private readonly helpImages: Image[];
    private readonly leftButton: Button<void>;
    private readonly rightButton: Button<void>;
    private readonly closeButton: Button<void>;
    private readonly leftImage: Image;
    private readonly rightImage: Image;
    private readonly closeImage: Image;

    private nowPage: number = 0;

    constructor(
        helpImageKeys: string[],
        leftImageKey: string,
        rightImageKey: string,
        closeImageKey: string,
    ){

        this.event = new EventEmitter();
        this._onClose = new EventPort("OnClose", this.event);

        this.layer = new Layer();
        this.wrapper = new Wrapper(this.layer, 0, 0, 1200, 800, 0x000000, 0.5);
        this.rightButton = new Button(
            this.layer, 700, 700, 200, 100, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(0)
        );
        this.rightImage = new Image(this.layer,        700, 700, 200, 100, rightImageKey);
        this.leftButton = new Button(
            this.layer, 300, 700, 200, 100, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(0)
        );
        this.leftImage = new Image(this.layer,        300, 700, 200, 100, leftImageKey);
        this.closeButton = new Button(
            this.layer, 1100, 0, 100, 100, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.closeImage = new Image(this.layer,        1100, 0, 100, 100, closeImageKey);
        this.helpImages = helpImageKeys.map(i => {
            const ret = new Image(this.layer, 0, 0, 1100, 700, i);
            return ret;
        });

        this.rightButton.OnDown.on(() => {
            this.helpImages[this.nowPage].Setting(i => i.setVisible(false));
            this.nowPage++;
            if(this.nowPage >= this.helpImages.length)
                this.nowPage = 0;
            this.helpImages[this.nowPage].Setting(i => i.setVisible(true));
        });
        this.leftButton.OnDown.on(() => {
            this.helpImages[this.nowPage].Setting(i => i.setVisible(false));
            this.nowPage--;
            if(this.nowPage < 0)
                this.nowPage = this.helpImages.length - 1;
            this.helpImages[this.nowPage].Setting(i => i.setVisible(true));
        });
        this.closeButton.OnTweenEnd.on(() => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            this.event.emit(this._onClose);
        });
    }

    SetScene(scene: Phaser.Scene): void {
        this.layer.SetScene(scene).Setting(l => l.setVisible(false).setActive(false));
        this.wrapper.SetScene(scene).Setting(r => r.setInteractive());
        this.helpImages.forEach(i => {
            i.SetScene(scene).Setting(i => i.setVisible(false));
        })
        this.helpImages[this.nowPage].Setting(i => i.setVisible(true));
        this.rightImage.SetScene(scene);
        this.rightButton.SetScene(scene);
        this.leftImage.SetScene(scene);
        this.leftButton.SetScene(scene);
        this.closeImage.SetScene(scene);
        this.closeButton.SetScene(scene);

    }

    Show(){
        this.nowPage = 0;
        this.helpImages.forEach(i => i.Setting(i => i.setVisible(false)));
        this.helpImages[this.nowPage].Setting(i => i.setVisible(true));
        this.layer.Setting(l => l.setVisible(true).setActive(true));
    }

    Destory(): void{
        this._onClose.removeAllListeners();
        this.wrapper.Destory();
        this.helpImages.forEach(i => {
            i.Destory();
        })
        this.rightImage.Destory();
        this.rightButton.Destory();
        this.leftImage.Destory();
        this.leftButton.Destory();
        this.closeImage.Destory();
        this.closeButton.Destory();
        this.layer.Destory();
    }

}