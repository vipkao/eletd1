import { EventEmitter, EventPort } from "../Utils/EventEmitter";
import { Audiences } from "../Element/Audiences";
import { IAudience, ISubscriber } from "../Element/interfaces";
import { Members } from "../Element/Members";
import { ITickWorker } from "../Updater/interfaces";
import { EachWork } from "../Updater/TickWorker/EachWork";
import { CheckEnd } from "./CheckEnd";
import { CheckSubscribe } from "./CheckSubscribe";
import { ByCalculator as CollaborationSatisfiedCalculator } from "./CollaborationSatisfiedCalculator/ByCalculator";
import { ListenLive } from "./ListenLive";
import { TypeA } from "./LiveTasteCalculator/TypeA";
import { MoveAudiences } from "./MoveAudiences";
import { ByCalculator as SingleSatisfiedCalculator } from "./SingleSatisfiedCalculator/ByCalculator";

export class Facade{
    
    private readonly event : EventEmitter;
    
    private readonly _onSuccessEnded : EventPort<() => void>;
    get OnSuccessEnded(): EventPort<() => void>{
        return this._onSuccessEnded;
    }
    
    private readonly _onFailEnded : EventPort<() => void>;
    get OnFailEnded(): EventPort<() => void>{
        return this._onFailEnded;
    }

    private readonly _onMembersListeningTick : EventPort<(audiences: IAudience[]) => void>;
    get OnMembersListeningTick(): EventPort<(audiences: IAudience[]) => void>{
        return this._onMembersListeningTick;
    }
    
    private readonly _onMembersNotListeningTick : EventPort<(audiences: IAudience[]) => void>;
    get OnMembersNotListeningTick(): EventPort<(audiences: IAudience[]) => void>{
        return this._onMembersNotListeningTick;
    }

    private readonly _tickWorker: ITickWorker;
    get tickWorker(): ITickWorker{
        return this._tickWorker;
    }

    constructor(
        audiences: Audiences,
        members: Members,
        subscriber: ISubscriber
    ){
        this.event = new EventEmitter();
        this._onSuccessEnded = new EventPort("OnSuccessEnded", this.event);
        this._onFailEnded = new EventPort("OnFailEnded", this.event);
        this._onMembersListeningTick = new EventPort("OnMembersListeningTick", this.event);
        this._onMembersNotListeningTick = new EventPort("OnMembersNotListeningTick", this.event);

        const checkEnd = new CheckEnd(
            audiences, subscriber
        );
        checkEnd.OnSuccessEnded.on(() => {
            this.event.emit(this._onSuccessEnded);
        });
        checkEnd.OnFailEnded.on(() => {
            this.event.emit(this._onFailEnded);
        });

        const listenLive = new ListenLive(
            members,
            audiences,
            new SingleSatisfiedCalculator(
                new TypeA()
            ),
            new CollaborationSatisfiedCalculator(
                new TypeA()
            ),
        );
        listenLive.OnMembersListening.on(ms => {
            this.event.emit(this._onMembersListeningTick, ms);
        });
        listenLive.OnMembersNotListening.on(ms => {
            this.event.emit(this._onMembersNotListeningTick, ms);
        });

        this._tickWorker = new EachWork([
            new MoveAudiences(
                audiences
            ),
            listenLive,
            new CheckSubscribe(
                audiences
            ),
            checkEnd
        ]);
    }


}