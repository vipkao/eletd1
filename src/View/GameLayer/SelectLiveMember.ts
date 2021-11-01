import { IMember } from "Model/Element/interfaces";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { Button } from "../Component/Button";
import { GridLayout } from "../Component/GridLayout";
import { Layer } from "../Component/Layer";
import { Wrapper } from "../Component/Wrapper";
import { IGameLayer } from "../interfaces";
import { Image } from "../Component/Image";
import { FormatLabel } from "../Component/FormatLabel";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";

/**
 * 配信を始めるメンバーを選ぶ画面。
 */
export class SelectLiveMember implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onSelected : EventPort<(spaceIndex: number, member: IMember) => void>;
    get OnSelected(): EventPort<(spaceIndex: number, member: IMember) => void>{
        return this._onSelected;
    }

    private readonly _onExit : EventPort<(spaceIndex: number, member: IMember) => void>;
    get OnExit(): EventPort<(spaceIndex: number, member: IMember) => void>{
        return this._onExit;
    }

    private readonly _onCancel : EventPort<() => void>;
    get OnCancel(): EventPort<() => void>{
        return this._onCancel;
    }

    private readonly model: Model;

    private readonly layer: Layer;
    private readonly background: Wrapper;
    private readonly headerImage: Image;
    private readonly cancelImage: Image;
    private readonly cancel: Button<void>;
    private readonly exitImage: Image;
    private readonly exit: Button<void>;
    private readonly memberImages: Image[];
    private readonly memberButtons: Button<IMember>[];
    private readonly changeLimitText: FormatLabel;

    private liveSpaceIndex: number = -1;

    constructor(
        model: Model,
        selectMemberImageKey: string,
        cancelImageKey: string,
        exitImageKey: string,
        memberImageIdKeys: {[key: number]: string}
    ){
        this.event = new EventEmitter();
        this._onSelected = new EventPort("OnSelected", this.event);
        this._onExit = new EventPort("OnExit", this.event);
        this._onCancel = new EventPort("OnCancel", this.event);

        this.model = model;

        this.layer = new Layer();

        this.background = new Wrapper(
            this.layer,
            0, 0, 1200, 800, 0xEEEEFF, 0.6
        );

        this.headerImage = new Image(
            this.layer, 250, 0, 700, 200, selectMemberImageKey
        );

        this.cancel = new Button(
            this.layer, 450, 600, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.cancel.OnTweenEnd.on(() => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            this.event.emit(this._onCancel);
        });
        this.cancelImage = new Image(
            this.layer, 450, 600, 300, 200, cancelImageKey
        );

        this.exit = new Button(
            this.layer, 900, 600, 300, 200, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.exit.OnTweenEnd.on(() => {
            this.layer.Setting(l => l.setVisible(false).setActive(false));
            const m = this.model.element.liveSpace.space[this.liveSpaceIndex];
            if(m === null)
                throw new Error("mはnullになるのはおかしい。UIの制御ミス。");
            this.event.emit(this._onExit, this.liveSpaceIndex, m);
        });
        this.exitImage = new Image(
            this.layer, 900, 600, 300, 200, exitImageKey
        );

        const memberLayout = new GridLayout(
            "horizontal", 6, 200, 200, 0, 200, 0
        );
        const allMember = this.model.element.members.all;
        this.memberImages = allMember.map((m, i) => {
            const ret = new Image(
                this.layer,
                memberLayout.Layout(i).x, memberLayout.Layout(i).y,
                200, 200,
                memberImageIdKeys[m.id]
            );
            return ret;
        });
        this.memberButtons = allMember.map((m, i) => {
            const ret = new Button<IMember>(
                this.layer,
                memberLayout.Layout(i).x, memberLayout.Layout(i).y,
                200, 200, m, 
                new RectangleBreath(0xFFFFFF, 0.5, 1),
                new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
                new DownToClick(1200)
            )
            ret.OnDown.on(m => {
            });
            ret.OnTweenEnd.on(m => {
                this.layer.Setting(l => l.setVisible(false).setActive(false));
                this.event.emit(this._onSelected, this.liveSpaceIndex, m);
            });
            return ret;
        });

        this.changeLimitText = new FormatLabel(
            this.layer, 950, 150
        ).SetFormat("残り{0}回");
        this.changeLimitText.SetValues(this.model.operator.memberChanger.remaining);
        this.model.operator.memberChanger.OnRemainingChanged.on(n => {
            this.changeLimitText.SetValues(n);
        });

    }



    SetScene(scene: Phaser.Scene): void {

        this.layer.SetScene(scene);
        //初期非表示
        this.layer.Setting(l => l.setVisible(false).setActive(false));

        //下層にクリックを検出させないようにする。
        this.background.SetScene(scene).Setting(r => r.setInteractive());

        this.headerImage.SetScene(scene);

        this.cancelImage.SetScene(scene);
        this.cancel.SetScene(scene);

        this.exitImage.SetScene(scene);
        this.exit.SetScene(scene);

        this.memberImages.forEach((b, i)=>{
            b.SetScene(scene);
        });
        this.memberButtons.forEach((b, i)=>{
            b.SetScene(scene);
        });

        this.changeLimitText.SetScene(scene)
            .Setting(t => t.setFontSize(60).setColor("#3333FF").setStroke("#3333FF", 1).setShadow(0, 0, "#FFFFFF", 4, true).setPadding(4))
            .Show();
    }

    Show(index: number, member: IMember | null){
        this.liveSpaceIndex = index;
        this.layer.Setting(l => l.setVisible(true).setActive(true));
        if(member === null){
            this.exit.Setting(i => i.setVisible(false));
            this.exitImage.Setting(i => i.setVisible(false));
        }else{
            this.exit.Setting(i => i.setVisible(true));
            this.exitImage.Setting(i => i.setVisible(true));
        }
    }

    Destory(): void{
        this._onCancel.removeAllListeners();
        this._onSelected.removeAllListeners();
        this.background.Destory();
        this.headerImage.Destory();
        this.cancelImage.Destory();
        this.cancel.Destory();
        this.memberImages.forEach((b, i)=>{
            b.Destory();
        });
        this.memberButtons.forEach((b, i)=>{
            b.Destory();
        });
        this.changeLimitText.Destory();
        this.layer.Destory();
    }

}