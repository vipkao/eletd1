import { EventEmitter, EventPort } from "../Utils/EventEmitter";
import { Concretes } from "./Concretes";
import { IMillisecondServer, ITickWorker } from "./interfaces";
import { Delta as TickDetector_Delta } from "./TickDetector/Delta";
import { Preset as DeltaServer_Preset } from "./TickDetector/DeltaServer/Preset";
import { EachWork } from "./TickWorker/EachWork";
import { EmitEvent as TickWorker_EmitEvent } from "./TickWorker/EmitEvent";
import { LastStock } from "./TickWorker/LastStock";
import { Stoppable } from "./TickWorker/Stoppable";
import { UpdateToTick } from "./UpdateToTick";

export class Facade{

    private readonly event : EventEmitter;

    //TODO インターフェースにする？
    private readonly updater: UpdateToTick;

    private readonly stoppable: Stoppable;
    private readonly _lastTick: LastStock;
    private readonly lastTickEvent: TickWorker_EmitEvent;

    private readonly deltaServer: DeltaServer_Preset;

    private readonly _onTickDone: EventPort<(tick: number) => void>;
    get OnTickDone(){
        return this._onTickDone;
    }

    get lastTick(): number{
        return this._lastTick.lastTick;
    }

    constructor(
        millisecondServer: IMillisecondServer,
        additionalWorker: ITickWorker
    ){
        this._lastTick = new LastStock();
        this.lastTickEvent = new TickWorker_EmitEvent();
        this.deltaServer = new DeltaServer_Preset();

        this.event = new EventEmitter();
        this._onTickDone = new EventPort("OnTickDone", this.event);

        this.lastTickEvent.OnDone.on(
            tick => this.event.emit(this._onTickDone, tick)
        );

        this.stoppable = new Stoppable(
            true,
            new EachWork(
                [
                    additionalWorker,
                    this._lastTick, //これも最後の方
                    this.lastTickEvent //これは必ず最後
                ]
            )
        );

        this.updater = new UpdateToTick(
            millisecondServer,
            new TickDetector_Delta(
                this.deltaServer
            ),
            this.stoppable
        );

    }

    public DoUpdate(): void{
        this.updater.Do();
    }

    public SetDelta(delta: number): void{
        this.deltaServer.delta = delta;
    }

    public StopTick(): void{
        this.stoppable.Stop();
    }

    public ResumeTick(): void{
        this.stoppable.Resume();
    }
}