import "phaser";
import { PhaserScene } from "./PhaserScene";
import { IEnding } from "Model/interfaces";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { Ending } from "./GameLayer/Ending";
import { PhaserGame } from "./PhaserGame";

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

    private readonly phaserGame: PhaserGame;

    constructor(
        subscriber: number,
        background: string,
        phaserGame: PhaserGame
    ){
        this.event = new EventEmitter();
        this._onExit = new EventPort("OnExit", this.event);

        this.background = background;
        this.phaserGame = phaserGame;

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

        this.phaserGame.Switch(scene);
    }

    Destroy(){
        this.ending.Destory();
    }
}