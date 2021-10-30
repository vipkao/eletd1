import { Audiences } from "../Element/Audiences";
import { Members } from "../Element/Members";
import { IAudience, IMember } from "../Element/interfaces";
import { ITickWorker } from "../Updater/interfaces";
import { ICollaborationSatisfiedCalculator, ISingleSatisfiedCalculator } from "./interfaces";
import { EventEmitter, EventPort } from "../Utils/EventEmitter";

/**
 * リスナーが配信を見ているか判定し、必要に応じて満足度を変化させる。
 */
export class ListenLive implements ITickWorker{

    private readonly event : EventEmitter;
    
    private readonly _onMembersListening : EventPort<(audiences: IAudience[]) => void>;
    get OnMembersListening(): EventPort<(audiences: IAudience[]) => void>{
        return this._onMembersListening;
    }
    
    private readonly _onMembersNotListening : EventPort<(audiences: IAudience[]) => void>;
    get OnMembersNotListening(): EventPort<(audiences: IAudience[]) => void>{
        return this._onMembersNotListening;
    }

    private readonly members: Members;
    private readonly audiences: Audiences;
    private readonly single: ISingleSatisfiedCalculator;
    private readonly collab: ICollaborationSatisfiedCalculator;

    constructor(
        members: Members,
        audiences: Audiences,
        single: ISingleSatisfiedCalculator,
        collab: ICollaborationSatisfiedCalculator
    ){
        this.event = new EventEmitter();
        this._onMembersListening = new EventPort("OnMembersListening", this.event);
        this._onMembersNotListening = new EventPort("OnMembersNotListening", this.event);

        this.members = members;
        this.audiences = audiences;
        this.single = single;
        this.collab = collab;
    }

    Do(tick: number): void {

        const nowListening : IAudience[] = [];
        const notListening : IAudience[] = [];

        this.audiences.exists.forEach(audience => {
            const members : IMember[] = [];
            this.members.ForEach(member => {
                if(!member.IsLive()) return;
                if(!member.IsListened(audience)) return;
                members.push(member);
            })

            if(members.length === 0){
                notListening.push(audience);
                return;
            }
            nowListening.push(audience);

            audience.ListenLive();
            if(!audience.IsListenFinished())
                return;

            if(members.length === 1){
                const s = this.single.Calc(audience, members[0]);
                audience.AddSatisfaction(s);
                return;
            }
            
            const s = this.collab.Calc(audience, members);
            audience.AddSatisfaction(s);
            return;
        });

        this.event.emit(this._onMembersListening, nowListening);
        this.event.emit(this._onMembersNotListening, notListening);
    }


    


}