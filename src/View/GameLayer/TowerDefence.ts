import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { Audience as AudienceImage } from "../Component/Audience";
import { Graphics } from "../Component/Graphics";
import { GraphicsImage } from "../Component/GraphicsImage";
import { Image } from "../Component/Image";
import { Layer } from "../Component/Layer";
import { IGameLayer, ILiveAreaDrawer } from "../interfaces";

/**
 * 画面左のタワーディフェンス部分の画面。
 * 画面右のメンバー一覧などは対象外。
 */
export class TowerDefence implements IGameLayer{

    private readonly event : EventEmitter;
    

    private readonly model: Model;
    private readonly member50ImageIdKeys: {[key: number]: string};
    private readonly memberLiveAreaIdKeys: {[key: number]: ILiveAreaDrawer};

    private readonly layer: Layer;
    private readonly background: Image;
    private readonly route: GraphicsImage;
    private readonly liveArea: GraphicsImage;
    private readonly memberImages: {[key: number]: Image};

    private readonly audienceImages: {[key: number]: AudienceImage};


    constructor(
        model: Model,
        stageBaseImageKey: string,
        listenImageKey: string,
        goodImageKey: string,
        numberAtlasImageKey: string,
        audienceImageIdKeys: {[key: number]: string},
        member50ImageIdKeys: {[key: number]: string},
        memberLiveAreaIdKeys: {[key: number]: ILiveAreaDrawer}
    ){
        this.event = new EventEmitter();

        this.model = model;
        this.member50ImageIdKeys = member50ImageIdKeys;
        this.memberLiveAreaIdKeys = memberLiveAreaIdKeys;

        this.audienceImages = {};

        this.layer = new Layer();
        this.background = new Image(
            this.layer, 0, 0, 1200, 800, stageBaseImageKey
        );
        this.route = new GraphicsImage(
            this.layer, 0, 0, 800, 800
        );
        this.liveArea = new GraphicsImage(
            this.layer, 0, 0, 800, 800
        );
        this.memberImages = {};
        this.model.element.members.all.forEach(m => {
            //センタリングするのでw/hは0
            const image = new Image(
                this.layer,
                0, 0, 0, 0,
                member50ImageIdKeys[m.id]
            );
            this.memberImages[m.id] = image;
        });

        this.audienceImages = {};
        this.model.element.audiences.all.forEach(a => {
            const image = new AudienceImage(
                this.layer, a.maxSatisfaction,
                audienceImageIdKeys[a.id], goodImageKey, listenImageKey, numberAtlasImageKey
            )
            this.audienceImages[a.id] = image;

            a.OnLogin.on(_ => {
                this.audienceImages[a.id].SetVisible(true);
            });
            a.OnPositionChanged.on((_, p) => {
                this.audienceImages[a.id].SetPosition(p.x, p.y);
            });
            a.OnSubscribed.on((_, s) => {
                this.audienceImages[a.id].ShowGood();
            });
            a.OnDisappointed.on((_, s) => {
                this.audienceImages[a.id].SetVisible(false);
            });
            a.OnSatisfactionUp.on((_, s) => {
                this.audienceImages[a.id].AddSatisfaction(s);
            });
        });

        this.model.tick.OnMembersListeningTick.on(audiences => {
            audiences.forEach(a => {
                this.audienceImages[a.id].SetListenVisible(true);
            });
        });
        this.model.tick.OnMembersNotListeningTick.on(audiences => {
            audiences.forEach(a => {
                this.audienceImages[a.id].SetListenVisible(false);
            });
        });

        this.model.element.members.all.forEach(m => {
            m.OnLiveStarted.on(() =>{
                this.DrawLiveSpace();
                this.memberImages[m.id]
                    .SetPosition(m.position.x, m.position.y)
                    .Setting(i => i.setVisible(true));
            });
            m.OnLiveEnded.on(() =>{
                this.memberImages[m.id]
                    .Setting(i => i.setVisible(false));
            });
            m.OnPositionChanged.on(() =>{
                this.DrawLiveSpace();
            });
        });

    }

    SetScene(scene: Phaser.Scene): void {

        this.layer.SetScene(scene);

        this.background.SetScene(scene);

        this.route.SetScene(scene);
        const routePoints : {[key: string]: {x:number, y:number} } = {};
        this.model.element.audiences.all.forEach(_a => {
            const a = _a.Clone();
            while(true){
                if(a.IsEnd()) break;
                if(a.IsExist()){
                    routePoints[`${a.position.x}-${a.position.y}`] = {x: a.position.x, y: a.position.y};
                }
                a.Move();
            }
        });
        this.route.g.clear();
        for(const k in routePoints){
            const p = routePoints[k];
            this.route.g
                .fillStyle(0x111111).fillCircle(p.x, p.y, 3)
                .fillStyle(0xFFFFFF).fillCircle(p.x, p.y, 2);
        }
        this.route.Update();

        const audienceIds : number[] = [];
        for(const k in this.audienceImages){
            audienceIds.push(parseInt(k));
        }
        //先頭を最上部に持ってくるために逆順。for-inは取り出す順序が不定の為。
        audienceIds.reverse().forEach(id => {
            const i = this.audienceImages[id];
            i.SetScene(scene);
        })

        this.liveArea.SetScene(scene);
        scene.tweens.add({
            targets: this.liveArea.image,
            ease: "Sine.easeInOut",
            duration: 400,
            loop: -1,
            yoyo: true,
            alpha: { start: 0, to: 1 }
        });

        for(const k in this.memberImages){
            const i = this.memberImages[parseInt(k)];
            i.SetScene(scene).Setting(i => {
                i.setVisible(false);
                scene.tweens.add({
                    targets: i,
                    ease: "Sine.easeInOut",
                    duration: 300 + Math.random()*400,
                    loop: -1,
                    yoyo: true,
                    scaleY: { start: 1.0, to: 0.9 },
                    //loopDelay: Math.random()*1000
                });
            });
        }

    }

    Destory(): void{
        this.background.Destory();
        this.route.Destory();
        for(const k in this.audienceImages){
            const i = this.audienceImages[parseInt(k)];
            i.Destory();
        }
        this.liveArea.Destory();
        for(const k in this.memberImages){
            const i = this.memberImages[parseInt(k)];
            i.Destory();
        }
        this.layer.Destory();
    }

    private DrawLiveSpace(){
        this.liveArea.g.clear().fillStyle(0x6666FF, 0.1);
        this.model.element.members.all.forEach(m => {
            if(!m.IsLive()) return;
            this.memberLiveAreaIdKeys[m.id].Fill(
                m.position.x, m.position.y, this.liveArea.g
            );
        });
        this.liveArea.Update();
    }

}