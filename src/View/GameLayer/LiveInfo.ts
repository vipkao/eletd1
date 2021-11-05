import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { Button } from "../Component/Button";
import { FormatLabel } from "../Component/FormatLabel";
import { GridLayout } from "../Component/GridLayout";
import { Layer } from "../Component/Layer";
import { IGameLayer } from "../interfaces";
import { Image } from "../Component/Image";
import { SpeedType } from "#/Model/Operator/interfaces";
import { RectangleBreath } from "../Component/Customize/Highlighter/RectangleBreath";
import { Nop as NopHighlighter } from "../Component/Customize/Highlighter/Nop";
import { RepeatRectangle } from "../Component/Customize/Flasher/RepeatRectangle";
import { DownToClick } from "../Component/Customize/ClickDetector/DownToClick";
import { IMember } from "#/Model/Element/interfaces";
import { BuildAtlasedTextBlitter } from "../Component/Util";
import { Blitter } from "../Component/Blitter";

type StopButtonImageKeys = "run" | "stop";

/**
 * 画面右の登録者数や配信中メンバーの一覧の画面。
 * 画面左のＴＤパートは対象外。
 */
export class LiveInfo implements IGameLayer{

    private readonly event : EventEmitter;
    
    private readonly _onSelected : EventPort<(index: number, member: IMember | null) => void>;
    get OnSelected(): EventPort<(index: number, member: IMember | null) => void>{
        return this._onSelected;
    }

    private readonly _onSelectDenied : EventPort<() => void>;
    get OnSelectDenied(): EventPort<() => void>{
        return this._onSelectDenied;
    }

    private readonly _onHelp : EventPort<() => void>;
    get OnHelp(): EventPort<() => void>{
        return this._onHelp;
    }

    private readonly _onNeedStop : EventPort<() => void>;
    get OnNeedStop(): EventPort<() => void>{
        return this._onNeedStop;
    }


    private readonly model: Model;

    private scene: Phaser.Scene | null = null;
    private readonly layer: Layer;
    private readonly baseImage: Image;
    private readonly subscribedCount: SubscribedCount;
    private readonly liveSpaceButtons: Button<number>[];
    private readonly liveMemberImages: { [key in number]: Image }
    private readonly liveSpaceOkImages: Image[];
    private readonly liveSpaceNgImages: Image[];
    private readonly speedButton: Button<void>;
    private readonly speedButtonActiveImages: { [key in SpeedType]: Image };
    private readonly speedButtonStopImages: { [key in SpeedType]: Image };
    private readonly stopButton: Button<void>;
    private readonly stopButtonImages: { [key in StopButtonImageKeys]: Image};
    private readonly helpButton: Button<void>;

    constructor(
        model: Model,
        baseImageKey: string,
        speed0ImageKey: string,
        speed1ImageKey: string,
        speed2ImageKey: string,
        speed3ImageKey: string,
        speed4ImageKey: string,
        speed5ImageKey: string,
        speed6ImageKey: string,
        speed7ImageKey: string,
        liveSpaceOkImageKey: string,
        liveSpaceNgImageKey: string,
        numberAtlasImageKey: string,
        subscriberAtlasImageKey: string,
        memberImageIdKeys: {[key: number]: string},
    ){
        this.model = model;

        this.event = new EventEmitter();
        this._onSelected = new EventPort("OnSelected", this.event);
        this._onSelectDenied = new EventPort("OnSelectDenied", this.event);
        this._onHelp = new EventPort("OnHelp", this.event);
        this._onNeedStop = new EventPort("OnNeedStop", this.event);

        this.layer = new Layer();

        this.baseImage = new Image(this.layer, 800, 0, 400, 800, baseImageKey);
        this.subscribedCount = new SubscribedCount(this.layer, subscriberAtlasImageKey);
        this.model.element.subscriber.OnNowChanged.on((count, delta) => {
            this.subscribedCount.ShowNow(count);
            if(this.scene !== null && delta !== 0){
                const dx = Math.random() * 100 - 50;
                const dy = Math.random() * 20 - 10;
                const sign = delta < 0 ? "-" : "+";
                const deltaBlitter = BuildAtlasedTextBlitter(
                    sign+Math.abs(delta).toString(),
                    8, numberAtlasImageKey, this.scene
                )
                deltaBlitter.setPosition(990+dx, 20+dy);
                const y = delta < 0 ? 10 : -10;
                this.layer.Setting(l => l.add(deltaBlitter));
                this.scene.tweens.add({
                    targets: deltaBlitter,
                    duration: 2000,
                    y:{ start: 20+dy, to:20+dy+y, ease: "Expo.easeOut" },
                    alpha: { start: 1, to: 0, ease: "Expo.easeIn" },
                    onComplete: () => { deltaBlitter.destroy(); }
                });
            }
        });

        this.liveMemberImages = {};
        this.model.element.members.all.forEach((m, i) => {
            const image = new Image(
                this.layer, 0, 0, 200, 200, memberImageIdKeys[m.id]
            );
            this.liveMemberImages[m.id] = image;
        });

        const liveSpaceButtonLayout = new GridLayout("horizontal", 2, 200, 200, 800, 100, 0);
        this.liveSpaceButtons = this.model.element.liveSpace.space.map((s, i) => {
            const ret = new Button<number>(
                this.layer,
                liveSpaceButtonLayout.Layout(i).x, liveSpaceButtonLayout.Layout(i).y,
                200, 200, i,
                new NopHighlighter(),
                new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
                new DownToClick(1200)
            )
            ret.OnDown.on(i => {
                this.event.emit(this._onNeedStop);
            });
            ret.OnTweenEnd.on(i => {
                if(this.model.operator.memberChanger.remaining === 0){
                    this.event.emit(this._onSelectDenied);
                }else{
                    this.event.emit(this._onSelected, i, this.model.element.liveSpace.space[i]);
                }
            });
            return ret;
        });            

        this.liveSpaceOkImages = [...Array(6)].map((_, i) => {
            const ret = new Image(
                this.layer,
                liveSpaceButtonLayout.Layout(i).x, liveSpaceButtonLayout.Layout(i).y,
                200, 200, liveSpaceOkImageKey
            );
            return ret;
        });
        this.liveSpaceNgImages = [...Array(6)].map((_, i) => {
            const ret = new Image(
                this.layer,
                liveSpaceButtonLayout.Layout(i).x, liveSpaceButtonLayout.Layout(i).y,
                200, 200, liveSpaceNgImageKey
            );
            return ret;
        });
        
        this.speedButton = new Button<void>(
            this.layer, 800, 700, 100, 100, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 10),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(0)
        );
        this.speedButton.toStringName = "speed";
        this.speedButton.OnDown.on(_ => {
            this.model.operator.speedChanger.ChangeNext();
        });

        this.stopButton = new Button<void>(
            this.layer, 900, 700, 100, 100, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 10),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(0)
        );
        this.stopButton.OnDown.on(_ => {
            this.model.operator.speedChanger.StopOrResume();
        });

        this.helpButton = new Button<void>(
            this.layer, 1100, 700, 100, 100, undefined,
            new RectangleBreath(0xFFFFFF, 0.5, 1),
            new RepeatRectangle(0xFFFFFF, 0.5, 2, 100, 1),
            new DownToClick(1200)
        );
        this.helpButton.OnDown.on(() => {
            this.event.emit(this._onNeedStop);
        });
        this.helpButton.OnTweenEnd.on(() => {
            this.event.emit(this._onHelp);
        });

        this.model.element.liveSpace.OnSpaceStarted.on((index, member) => {
            this.liveMemberImages[member.id]
                .SetPosition(
                    liveSpaceButtonLayout.Layout(index).x,
                    liveSpaceButtonLayout.Layout(index).y
                )
                .Setting(i => i.setVisible(true));
        });
        this.model.element.liveSpace.OnSpaceStoped.on((index, member) => {
            this.liveMemberImages[member.id].Setting(i => i.setVisible(false));
        });

        this.speedButtonActiveImages = {
            "normal": new Image(this.layer, 800, 700, 100, 100, speed1ImageKey),
            "high": new Image(this.layer, 800, 700, 100, 100, speed2ImageKey),
            "max": new Image(this.layer, 800, 700, 100, 100, speed3ImageKey),
        };
        this.speedButtonStopImages = {
            "normal": new Image(this.layer, 800, 700, 100, 100, speed5ImageKey),
            "high": new Image(this.layer, 800, 700, 100, 100, speed6ImageKey),
            "max": new Image(this.layer, 800, 700, 100, 100, speed7ImageKey),
        }
        this.stopButtonImages = {
            "run": new Image(this.layer, 900, 700, 100, 100, speed0ImageKey),
            "stop": new Image(this.layer, 900, 700, 100, 100, speed4ImageKey),
        }
        this.model.operator.speedChanger.OnDeltaChanged.on(() => {
            this.AllSpeedButtonImageHidden();
            if(this.model.operator.speedChanger.isStopped){
                this.speedButtonStopImages[this.model.operator.speedChanger.nowSpeed]
                    .Setting(i => i.setVisible(true));
                this.stopButtonImages["stop"].Setting(i => i.setVisible(true));
            }else{
                this.speedButtonActiveImages[this.model.operator.speedChanger.nowSpeed]
                    .Setting(i => i.setVisible(true));
                this.stopButtonImages["run"].Setting(i => i.setVisible(true));
            }
        });


        this.model.tick.OnFailEnded.on(() => {
            this.DisableButtons();
        });
        this.model.tick.OnSuccessEnded.on(() => {
            this.DisableButtons();
        });

    }

    SetScene(scene: Phaser.Scene): void {
        this.scene = scene;
        this.layer.SetScene(scene);

        this.baseImage.SetScene(scene);
        this.subscribedCount.SetScene(scene);
        this.subscribedCount.ShowTarget(this.model.element.subscriber.target);
        this.subscribedCount.ShowNow(this.model.element.subscriber.now);

        for(const k in this.liveMemberImages){
            const v = this.liveMemberImages[parseInt(k)];
            v.SetScene(scene).Setting(i => i.setVisible(false));
        }

        this.liveSpaceOkImages.forEach((b, i) => {
            b.SetScene(scene).Setting(image => image.setVisible(true))
                .Setting(i => {
                    scene.tweens.add({
                        targets: i,
                        ease: "Sine.easeInOut",
                        duration: 1200,
                        loop: -1,
                        yoyo: true,
                        alpha: { start: 0, to: 1 }
                    });            
                });
            if(i < this.model.element.liveSpace.max) return;
            b.Setting(image => image.setVisible(false));
        });
        this.liveSpaceNgImages.forEach((b, i) => {
            b.SetScene(scene).Setting(image => image.setVisible(true));
            if(i >= this.model.element.liveSpace.max) return;
            b.Setting(image => image.setVisible(false));
        });
        
        this.liveSpaceButtons.forEach(b => {
            b.SetScene(scene);
        });

        for(const k in this.speedButtonActiveImages){
            const v = this.speedButtonActiveImages[k as SpeedType];
            v.SetScene(scene).Setting(i => i.setVisible(false));
        }
        for(const k in this.speedButtonStopImages){
            const v = this.speedButtonStopImages[k as SpeedType];
            v.SetScene(scene).Setting(i => i.setVisible(false));
        }
        for(const k in this.stopButtonImages){
            const v = this.stopButtonImages[k as StopButtonImageKeys];
            v.SetScene(scene).Setting(i => i.setVisible(false));
        }

        this.speedButton.SetScene(scene);
        this.stopButton.SetScene(scene);

        if(this.model.operator.speedChanger.isStopped){
            this.speedButtonStopImages[this.model.operator.speedChanger.nowSpeed]
                .Setting(i => i.setVisible(true));
            this.stopButtonImages["stop"].Setting(i => i.setVisible(true));
        }else{
            this.speedButtonActiveImages[this.model.operator.speedChanger.nowSpeed]
                .Setting(i => i.setVisible(true));      
            this.stopButtonImages["run"].Setting(i => i.setVisible(true));
        }
            
        this.helpButton.SetScene(scene);

    }

    EnableButtons(){
        this.liveSpaceButtons.forEach(b => b.SetEnable(true));
        this.speedButton.SetEnable(true);
    }
    DisableButtons(){
        this.liveSpaceButtons.forEach(b => b.SetEnable(false));
        this.speedButton.SetEnable(false);
    }

    Destory(): void{
        this._onHelp.removeAllListeners();
        this._onNeedStop.removeAllListeners();
        this._onSelectDenied.removeAllListeners();
        this._onSelected.removeAllListeners();
        this.baseImage.Destory();
        for(const k in this.liveMemberImages){
            const v = this.liveMemberImages[parseInt(k)];
            v.Destory();
        }
        this.liveSpaceOkImages.forEach((b, i) => {
            b.Destory();
        });
        this.liveSpaceNgImages.forEach((b, i) => {
            b.Destory();
        });
        this.liveSpaceButtons.forEach(b => {
            b.Destory();
        });
        for(const k in this.speedButtonActiveImages){
            const v = this.speedButtonActiveImages[k as SpeedType];
            v.Destory();
        }
        for(const k in this.speedButtonStopImages){
            const v = this.speedButtonStopImages[k as SpeedType];
            v.Destory();
        }
        for(const k in this.stopButtonImages){
            const v = this.stopButtonImages[k as StopButtonImageKeys];
            v.Destory();
        }
        this.speedButton.Destory();
        this.stopButton.Destory();
        this.helpButton.Destory();
        this.layer.Destory();
    }

    private AllSpeedButtonImageHidden(){
        for(const k in this.speedButtonActiveImages){
            const v = this.speedButtonActiveImages[k as SpeedType];
            v.Setting(i => i.setVisible(false));
        }
        for(const k in this.speedButtonStopImages){
            const v = this.speedButtonStopImages[k as SpeedType];
            v.Setting(i => i.setVisible(false));
        }
        for(const k in this.stopButtonImages){
            const v = this.stopButtonImages[k as StopButtonImageKeys];
            v.Setting(i => i.setVisible(false));
        }
    }

}

class SubscribedCount{

    private readonly nowCount: Blitter;
    private readonly targetCount: Blitter;


    constructor(
        layer: Layer,
        atlasKey: string,
    ){
        this.nowCount = new Blitter(layer, 810, 0, atlasKey);
        this.targetCount = new Blitter(layer, 810, 50, atlasKey);
    }

    SetScene(scene: Phaser.Scene){
        this.nowCount.SetScene(scene);
        this.targetCount.SetScene(scene);
    }

    ShowTarget(count: number){
        this.targetCount.Clear();
        const text = `m${count}n`;
        this.targetCount.ShowByChar(text, 10);
    }

    ShowNow(count: number){
        this.nowCount.Clear();
        const text = `t${count}n`;
        this.nowCount.ShowByChar(text, 10);
    }



}