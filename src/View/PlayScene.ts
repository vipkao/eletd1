import "phaser";
import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { PhaserScene } from "./PhaserScene";
import { StageStart } from "./GameLayer/StageStart";
import { SelectLiveMember } from "./GameLayer/SelectLiveMember";
import { LiveInfo } from "./GameLayer/LiveInfo";
import { TowerDefence } from "./GameLayer/TowerDefence";
import { PutMember } from "./GameLayer/PutMember";
import { StageSuccessEnd } from "./GameLayer/StargeSuccessEnd";
import { StageFailEnd } from "./GameLayer/StargeFailEnd";
import { IPlayStage } from "Model/interfaces";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { SaveData } from "Model/Element/SaveData";
import { ILiveAreaDrawer, IPhaserConfigFactory } from "./interfaces";
import { AreaType, Factory as AreaFactory } from "./LiveAreaDrawer/Factory";
import { MessageOk } from "./GameLayer/MessageOk";
import { Help } from "./GameLayer/Help";

export type PlaySceneImageKeys =
    "titleImage" | "captionImage"
    | "startButtonImage" | "liveInfoImage"
    | "speed0" | "speed1" | "speed2" | "speed3"
    | "liveOK" | "liveNG"
    | "goNext" | "goRetry" | "goTitle"
    | "ok" | "cancel" | "goLeft" | "goRight" | "close"
    | "successHeader" | "failHeader" | "selectMemberHeader" | "liveWhereHeader"
    | "signGood"
    | "infoListen"
    | "help1" | "help2" | "help3" | "help4"
    ;

type memberConfigKeys = {
    "200Image": string, "50Image": string, "area": ILiveAreaDrawer
};

/**
 * タワーディフェンス部分のゲーム。
 */
export class PlayScene implements IPlayStage{

    private readonly event : EventEmitter;

    private readonly _onNextStage : EventPort<(saveData: SaveData) => void>;
    get OnNextStage(): EventPort<(saveData: SaveData) => void> {
        return this._onNextStage;
    }
    private readonly _onRetryStage : EventPort<(saveData: SaveData) => void>;
    get OnRetryStage(): EventPort<(saveData: SaveData) => void> {
        return this._onRetryStage;
    }
    private readonly _onGoTitle : EventPort<(saveData: SaveData) => void>;
    get OnGoTitle(): EventPort<(saveData: SaveData) => void> {
        return this._onGoTitle;
    }

    private readonly sceneImages: { [key in PlaySceneImageKeys]: string };
    private readonly memberConfig: memberConfigKeys[];
    private readonly audienceImageIdKey: { [key: number]: string };
    private readonly helpImageKeys: string[];

    private readonly model: Model;

    private readonly stageStart: StageStart;
    private readonly stageSuccessEnd: StageSuccessEnd;
    private readonly stageFailEnd: StageFailEnd;
    private readonly towerDevence: TowerDefence;
    private readonly liveInfo: LiveInfo;
    private readonly selectLiveMember: SelectLiveMember;
    private readonly putMember: PutMember;
    private readonly cannotSelectLiveMember: MessageOk;
    private readonly help: Help;

    private readonly stageImage:string;
    private readonly _title: string;
    get title(): string { return this._title; }
    private readonly _caption: string;
    get caption(): string { return this._caption; }

    private readonly phaserConfigFactory: IPhaserConfigFactory;
    private phaserGame : Phaser.Game | null = null;

    constructor(
        title: string, caption: string,
        stageImage: string,
        sceneImages: { [key in PlaySceneImageKeys]: string },
        helpImageKeys: string[],
        stageAudiences: (string | number)[][],
        memberConfig: memberConfigKeys[],
        phaserConfigFactory: IPhaserConfigFactory,
        model: Model
    ){
        this._title = title;
        this._caption = caption;
        this.stageImage = `images/${stageImage}.jpg`;
        this.sceneImages = sceneImages;
        this.helpImageKeys = helpImageKeys;
        this.memberConfig = memberConfig;
        this.phaserConfigFactory = phaserConfigFactory;
        this.model = model;

        this.event = new EventEmitter();
        this._onNextStage = new EventPort("OnNextStage", this.event);
        this._onRetryStage = new EventPort("OnRetryStage", this.event);
        this._onGoTitle = new EventPort("OnGoTitle", this.event);

        this.model.updater.StopTick();

        this.audienceImageIdKey = {};
        this.model.element.audiences.all.forEach((a, i) => {
            const id = stageAudiences[i][0] as string;
            const path = `images/50a_${id}.png`;
            this.audienceImageIdKey[a.id] = path;
        });

        const member200ImageIdKey: {[key: number]: string} = {};
        this.model.element.members.all.forEach((m, i) => {
            member200ImageIdKey[m.id] = memberConfig[i]["200Image"];
        });
        const member50ImageIdKey: {[key: number]: string} = {};
        this.model.element.members.all.forEach((m, i) => {
            member50ImageIdKey[m.id] = memberConfig[i]["50Image"];
        });
        const memberLiveAreaIdKey: {[key: number]: ILiveAreaDrawer} = {};
        this.model.element.members.all.forEach((m, i) => {
            memberLiveAreaIdKey[m.id] = memberConfig[i]["area"];
        });

        this.stageStart = new StageStart(
            model,
            this._title, this._caption,
            sceneImages["titleImage"], sceneImages["captionImage"], sceneImages["startButtonImage"]
        );
        this.stageSuccessEnd = new StageSuccessEnd(model, sceneImages["successHeader"], sceneImages["goNext"], sceneImages["goRetry"], sceneImages["goTitle"]);
        this.stageFailEnd = new StageFailEnd(model, sceneImages["failHeader"], sceneImages["goNext"], sceneImages["goRetry"], sceneImages["goTitle"]);
        this.towerDevence = new TowerDefence(
            model,
            this.stageImage,
            sceneImages["infoListen"],
            sceneImages["signGood"],
            this.audienceImageIdKey,
            member50ImageIdKey,
            memberLiveAreaIdKey
        );
        this.liveInfo = new LiveInfo(
            model,
            sceneImages["liveInfoImage"],
            sceneImages["speed0"], sceneImages["speed1"], sceneImages["speed2"], sceneImages["speed3"],
            sceneImages["liveOK"], sceneImages["liveNG"],
            member200ImageIdKey
        );
        this.selectLiveMember = new SelectLiveMember(
            model,
            sceneImages["selectMemberHeader"], sceneImages["cancel"],
            member200ImageIdKey
        );
        this.putMember = new PutMember(
            model,
            sceneImages["liveWhereHeader"], sceneImages["ok"], sceneImages["cancel"],
            member50ImageIdKey, memberLiveAreaIdKey
        );
        this.cannotSelectLiveMember = new MessageOk(
            model,
            sceneImages["ok"]
        );
        this.help = new Help(
            helpImageKeys,
            sceneImages["goLeft"], sceneImages["goRight"], sceneImages["close"]
        );
    
        this.liveInfo.DisableButtons();

        this.stageStart.OnStart.on(() => {
            this.model.updater.ResumeTick();
            this.liveInfo.EnableButtons();
        });

        this.stageSuccessEnd.OnNext.on(() => {
            this.model.operator.stageNexter.Next();
        });
        this.stageSuccessEnd.OnRetry.on(() => {
            this.model.operator.stageNexter.Retry();
        });
        this.stageSuccessEnd.OnTitle.on(() => {
            this.model.operator.stageNexter.Title();
        });

        this.stageFailEnd.OnNext.on(() => {
            this.model.operator.stageNexter.Next();
        });
        this.stageFailEnd.OnRetry.on(() => {
            this.model.operator.stageNexter.Retry();
        });
        this.stageFailEnd.OnTitle.on(() => {
            this.model.operator.stageNexter.Title();
        });

        this.liveInfo.OnSelected.on(i => {
            this.selectLiveMember.Show(i);
            this.liveInfo.DisableButtons();
        });
        this.liveInfo.OnSelectDenied.on(() => {
            this.cannotSelectLiveMember.Show(200, 200, "配信可能回数の上限に達しました。")
                .text.Setting(t => t.setFontSize(60).setColor("#FFFFFF").setShadow(0,0,"#000000", 4, true).setPadding(4));
            this.liveInfo.DisableButtons();
        });
        this.liveInfo.OnHelp.on(() => {
            this.help.Show();
            this.liveInfo.DisableButtons();
        });
        this.liveInfo.OnNeedStop.on(() => {
            this.model.updater.StopTick();
        });

        this.help.OnClose.on(() => {
            this.model.updater.ResumeTick();
            this.liveInfo.EnableButtons();
        });

        this.selectLiveMember.OnSelected.on((i, m) => {
            this.putMember.Start(i, m);
        });
        this.selectLiveMember.OnCancel.on(() => {
            this.model.updater.ResumeTick();
            this.liveInfo.EnableButtons();
        });

        this.cannotSelectLiveMember.OnOk.on(() => {
            this.model.updater.ResumeTick();
            this.liveInfo.EnableButtons();
        });

        this.putMember.OnSelected.on((liveSpaceIndex, member, position) => {
            this.model.updater.ResumeTick();
            this.model.operator.memberChanger.ChangeMember(
                liveSpaceIndex, member, position
            );
            this.liveInfo.EnableButtons();
        });
        this.putMember.OnCancel.on(() => {
            this.model.updater.ResumeTick();
            this.liveInfo.EnableButtons();
        });

        this.model.operator.stageNexter.OnNext.on(saveData => {
            //TODO フェードでも入れる？
            this.event.emit(this._onNextStage, saveData);
        });
        this.model.operator.stageNexter.OnRetry.on(saveData => {
            this.event.emit(this._onRetryStage, saveData);
        });
        this.model.operator.stageNexter.OnTitle.on(saveData => {
            this.event.emit(this._onGoTitle, saveData);
        });

    }

    Start(): void{
        const scene = new PhaserScene(
            this._title,
            s => {
                s.load.image(this.stageImage, this.stageImage);
                for(const k in this.sceneImages){
                    const v = this.sceneImages[k as PlaySceneImageKeys];
                    //キャッシュが効いているかと思ったが、常にfalseを返してるので意味がなさそう。
                    if(s.textures.exists(v)) continue;
                    s.load.image(v, v);
                }
                const audienceSet = new Set<string>();
                for(const k in this.audienceImageIdKey){
                    const v = this.audienceImageIdKey[parseInt(k)];
                    audienceSet.add(v);
                }
                audienceSet.forEach(k => {
                    if(s.textures.exists(k)) return;
                    s.load.image(k, k);
                });
                this.memberConfig.forEach(k => {
                    if(!s.textures.exists(k["200Image"]))
                        s.load.image(k["200Image"], k["200Image"]);
                    if(!s.textures.exists(k["50Image"]))
                        s.load.image(k["50Image"], k["50Image"]);
                });
                this.helpImageKeys.forEach(k => {
                    if(s.textures.exists(k)) return;
                    s.load.image(k, k);
                })
            },
            s => {
                //最初にSetした方が下。レイヤーに乗せないと最上になる。
                this.towerDevence.SetScene(s);
                this.liveInfo.SetScene(s);
                this.stageStart.SetScene(s);
                this.stageSuccessEnd.SetScene(s);
                this.stageFailEnd.SetScene(s);
                this.selectLiveMember.SetScene(s);
                this.cannotSelectLiveMember.SetScene(s);
                this.putMember.SetScene(s);
                this.help.SetScene(s);
            },
            s => {
                this.model.updater.DoUpdate();
            }
        );

        const config = this.phaserConfigFactory.Create();
        config["scene"] = scene;
        this.phaserGame = new Phaser.Game(
            config
        );
    }

    Destroy(){
        this.towerDevence.Destory();
        this.liveInfo.Destory();
        this.stageStart.Destory();
        this.stageSuccessEnd.Destory();
        this.stageFailEnd.Destory();
        this.selectLiveMember.Destory();
        this.cannotSelectLiveMember.Destory();
        this.putMember.Destory();
        this.help.Destory();
        if(this.phaserGame === null) return;
        this.phaserGame.scene.getScenes().forEach(scene => {
            scene.textures.destroy();
        });
        this.phaserGame.scene.stop(this._title);
        this.phaserGame.scene.remove(this._title);
        //this.phaserGame.scene.destroy();
        this.phaserGame.destroy(true, false);
    }

    static CreateMemberConfigs(
        configs: (string|number[]|AreaType|number[][])[][]
    ): memberConfigKeys[]{
        const ret = configs.map(c => {
            const name = c[0] as string;
            const image200 = `images/200${name}1.png`;
            const image50 = `images/50${name}1.png`;
            const areaType = c[1] as AreaType;
            const areaValue = c[2] as number[];
            return {
                "200Image": image200,
                "50Image": image50,
                "area": AreaFactory.CreateFromAreaType(areaType, areaValue)
            };
        });
        return ret;
    }

}