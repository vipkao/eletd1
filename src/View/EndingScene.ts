import "phaser";
import { PhaserScene } from "./PhaserScene";
import { IEnding } from "Model/interfaces";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { Ending } from "./GameLayer/Ending";
import { SaveData } from "#/Model/Element/SaveData";

export type EndingSceneImageKeys =
    "ending1" | "ending2"
    ;

/**
 * エンディング。
 */
export class EndingScene implements IEnding{

    private readonly event : EventEmitter;

    private readonly _onExit : EventPort<() => void>;
    get OnExit(): EventPort<() => void>{
        return this._onExit;
    }

    private readonly ending: Ending;

    private readonly background: string;

    private phaserGame : Phaser.Game | null = null;

    constructor(
        subscriber: number,
        background: string
    ){
        this.event = new EventEmitter();
        this._onExit = new EventPort("OnExit", this.event);

        this.background = background;

        this.ending = new Ending(
            subscriber,
            background
        );

        this.ending.OnClosed.on(() => {
            this.event.emit(this._onExit);
        });

    }

    Start(): void{

        const scene = new PhaserScene(
            "タイトル",
            s => {
                if(!s.textures.exists(this.background))
                    s.load.image(this.background, this.background);
            },
            s => {
                this.ending.SetScene(s);
            },
            s => {
            }
        );

        this.phaserGame = new Phaser.Game(scene.config);
    }

    Destroy(){
        this.ending.Destory();
        if(this.phaserGame === null) return;
        this.phaserGame.destroy(true, false);
    }
}