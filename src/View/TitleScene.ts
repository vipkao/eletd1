import "phaser";
import { PhaserScene } from "./PhaserScene";
import { ITitle } from "Model/interfaces";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { Title } from "./GameLayer/Title";
import { SaveData } from "#/Model/Element/SaveData";
import { Help } from "./GameLayer/Help";

export type TitleSceneImageKeys =
    "background" | "newButton" | "continueButton"
    | "goLeft" | "goRight" | "close"
    | "help1" | "help2" | "help3" | "help4"
    ;

/**
 * タイトル。
 */
export class TitleScene implements ITitle{

    private readonly event : EventEmitter;

    private readonly _onStageSelected : EventPort<(index: number) => void>;
    get OnStageSelected(): EventPort<(index: number) => void>{
        return this._onStageSelected;
    }

    private readonly title: Title;
    private readonly help: Help;

    private readonly images: {[key in TitleSceneImageKeys]: string};
    private readonly buttonImageKey: string;
    private readonly helpImageKeys: string[];

    private phaserGame : Phaser.Game | null = null;

    constructor(
        images : {[key in TitleSceneImageKeys]: string},
        buttonImageKey: string,
        helpImageKeys: string[]
    ){
        this.event = new EventEmitter();
        this._onStageSelected = new EventPort("OnStageSelected", this.event);

        this.images = images;
        this.buttonImageKey = buttonImageKey;
        this.helpImageKeys = helpImageKeys;

        this.title = new Title(
            images["background"], buttonImageKey
        );

        this.help = new Help(
            helpImageKeys,
            images["goLeft"], images["goRight"], images["close"]
        );

        this.title.OnClosed.on(() => {
            this.event.emit(this._onStageSelected, 0);
        });
        this.title.OnHelp.on(() => {
            this.help.Show();
        });

        this.help.OnClose.on(() => {
        });

    }

    Start(saveData: SaveData): void{

        const scene = new PhaserScene(
            "タイトル",
            s => {
                for(const k in this.images){
                    const v = this.images[k as TitleSceneImageKeys];
                    if(s.textures.exists(v)) continue;
                    s.load.image(v, v);
                }
                s.load.image(this.buttonImageKey, this.buttonImageKey);
                this.helpImageKeys.forEach(k => {
                    if(s.textures.exists(k)) return;
                    s.load.image(k, k);
                })
            },
            s => {
                this.title.SetScene(s);
                this.help.SetScene(s);
            },
            s => {
            }
        );

        this.phaserGame = new Phaser.Game(scene.config);
    }

    Destroy(){
        this.title.Destory();
        this.help.Destory();
        if(this.phaserGame === null) return;
        this.phaserGame.destroy(true, false);
    }
}