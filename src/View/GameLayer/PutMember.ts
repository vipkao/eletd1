import { IMember, IPosition } from "Model/Element/interfaces";
import { Preset as Position } from "Model/Element/Position/Preset";
import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { Button } from "../Component/Button";
import { Graphics } from "../Component/Graphics";
import { Image } from "../Component/Image";
import { Layer } from "../Component/Layer";
import { Wrapper } from "../Component/Wrapper";
import { IGameLayer, ILiveAreaDrawer } from "../interfaces";

/**
 * メンバーをTD画面に配置する画面。
 */
export class PutMember implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onSelected : EventPort<(liveSpaceIndex: number, member: IMember, position: IPosition) => void>;
    get OnSelected(): EventPort<(liveSpaceIndex: number, member: IMember, position: IPosition) => void>{
        return this._onSelected;
    }

    private readonly _onCancel : EventPort<() => void>;
    get OnCancel(): EventPort<() => void>{
        return this._onCancel;
    }
    

    private readonly model: Model;
    private readonly member50ImageIdKeys: {[key: number]: string};
    private readonly memberLiveAreaIdKeys: {[key: number]: ILiveAreaDrawer};

    private readonly layer: Layer;
    private readonly background: Wrapper;
    private readonly putArea: Wrapper;
    private readonly memberImages: { [key in number]: Image }
    private readonly liveArea: Graphics;
    private readonly liveWhereImage: Image;
    private readonly cancelImage: Image;
    private readonly cancel: Button<void>;
    private readonly okImage: Image;
    private readonly ok: Button<void>;

    private liveSpaceIndex: number = -1;
    private member: IMember|null = null;
    private x: number = -1;
    private y: number = -1;


    constructor(
        model: Model,
        liveWhereImageKey: string,
        okImageKey: string,
        cancelImageKey: string,
        member50ImageIdKeys: {[key: number]: string},
        memberLiveAreaIdKeys: {[key: number]: ILiveAreaDrawer}
    ){
        this.event = new EventEmitter();
        this._onSelected = new EventPort("OnSelected", this.event);
        this._onCancel = new EventPort("OnCancel", this.event);

        this.model = model;
        this.member50ImageIdKeys = member50ImageIdKeys;
        this.memberLiveAreaIdKeys = memberLiveAreaIdKeys;

        this.layer = new Layer();

        this.background = new Wrapper(
            this.layer,
            800, 0, 400, 800, 0x000033, 0.8
        );

        this.liveArea = new Graphics(
            this.layer
        );

        this.putArea = new Wrapper(
            this.layer,
            0, 0, 800, 800, 0x330000, 0.1
        );
        this.putArea.OnDown.on((x, y) => {
            if(this.member === null) throw new Error("member");
            this.x = x;
            this.y = y;
            this.memberImages[this.member.id]
                .SetPosition(this.x, this.y)
            this.DrawArea(this.x, this.y, this.member);
        });

        this.memberImages = {};
        this.model.element.members.all.forEach((m, i) => {
            //センタリングのためにw/hは0
            const image = new Image(
                this.layer, 0, 0, 0, 0, this.member50ImageIdKeys[m.id]
            );
            this.memberImages[m.id] = image;
        });

        this.liveWhereImage = new Image(
            this.layer, 850, 50, 300, 200, liveWhereImageKey
        );

        this.ok = new Button(
            this.layer, 850, 300, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        )
        this.ok.OnTweenEnd.on(() => {
            this.layer.Setting(l => l.setVisible(false));
            if(this.member === null) throw new Error("member");
            this.event.emit(this._onSelected, this.liveSpaceIndex, this.member, new Position(this.x, this.y));
        });
        this.okImage = new Image(
            this.layer, 850, 300, 300, 200, okImageKey
        );

        this.cancel = new Button(
            this.layer, 850, 550, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        )
        this.cancel.OnTweenEnd.on(() => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            this.event.emit(this._onCancel);
        });
        this.cancelImage = new Image(
            this.layer, 850, 550, 300, 200, cancelImageKey
        );

    }

    SetScene(scene: Phaser.Scene): void {
        this.layer.SetScene(scene);
        //初期非表示
        this.layer.Setting(l => l.setVisible(false).setActive(false));

        //下層にクリックを検出させないようにする。
        this.background.SetScene(scene).Setting(r => r.setInteractive());

        this.liveArea.SetScene(scene).Setting(g => g.setVisible(true));

        for(const k in this.memberImages){
            const v = this.memberImages[parseInt(k)];
            v.SetScene(scene).Setting(i => i.setVisible(false));
        }

        this.putArea.SetScene(scene).Setting(r => r.setInteractive());

        this.liveWhereImage.SetScene(scene);
        this.okImage.SetScene(scene);
        this.ok.SetScene(scene);
        this.cancelImage.SetScene(scene);
        this.cancel.SetScene(scene);
    }

    Start(liveSpaceIndex: number, member: IMember): void{
        this.layer.Setting(l => l.setVisible(true).setActive(true));
        this.liveSpaceIndex = liveSpaceIndex;
        this.member = member;
        this.x = 400;
        this.y = 400;

        for(const k in this.memberImages){
            const v = this.memberImages[parseInt(k)];
            v.Setting(i => i.setVisible(false));
        }
        this.memberImages[member.id]
            .SetPosition(this.x, this.y)
            .Setting(i => i.setVisible(true));
        this.DrawArea(this.x, this.y, this.member);
    }

    DrawArea(x: number, y:number, member: IMember){
        this.liveArea.g.clear().fillStyle(0x6666FF, 0.3);
        this.memberLiveAreaIdKeys[member.id].Fill(
            x, y, this.liveArea.g
        );
    }
    
    Destory(): void{
        this._onCancel.removeAllListeners();
        this._onSelected.removeAllListeners();
        this.background.Destory();
        this.liveArea.Destory();
        for(const k in this.memberImages){
            const v = this.memberImages[parseInt(k)];
            v.Destory();
        }
        this.putArea.Destory();
        this.liveWhereImage.Destory();
        this.okImage.Destory();
        this.ok.Destory();
        this.cancelImage.Destory();
        this.cancel.Destory();
        this.layer.Destory();
    }
}