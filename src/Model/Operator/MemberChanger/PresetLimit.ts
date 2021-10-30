import { Invalid } from "Model/Element/Position/Invalid";
import { ILiveSpace, IMember, IPosition } from "Model/Element/interfaces";
import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { IMemberChanger } from "../interfaces";

/**
 * 変更可能回数を予め指定しておく実装。
 */
export class PresetLimit implements IMemberChanger{

    private readonly event : EventEmitter;
    
    private readonly _onRemainingChanged : EventPort<(remaining: number) => void>;
    get OnRemainingChanged(): EventPort<(remaining: number) => void> {
        return this._onRemainingChanged;
    };

    private readonly liveSpace: ILiveSpace;

    private _remaining: number;
    get remaining() : number{ return this._remaining; }
    
    /**
     * @param changeLimit 最大変更回数。
     */
    constructor(
        changeLimit: number,
        liveSpace: ILiveSpace
    ){
        this._remaining = changeLimit;
        this.liveSpace = liveSpace;

        this.event = new EventEmitter();
        this._onRemainingChanged = new EventPort("OnRemainingChanged", this.event);
    }        

    ChangeMember(index: number, newMember: IMember, position: IPosition): void {
        if(index < 0) throw new Error("liveIndex < 0:" + index);
        if(index > this.liveSpace.max - 1) throw new Error("liveIndex < max:" + index);

        //このエラーが発生する場合は、プログラムのミス。
        //予め残り回数をチェックし、操作側で実行させないように制御すること。
        if(this._remaining <= 0) throw new Error("remaining 0");
        this._remaining--;
        this.event.emit(this._onRemainingChanged, this._remaining);

        //既に別の枠で配信していたら停止させる。
        this.liveSpace.space.forEach((m, i) => {
            if(m === null) return;
            if(m.id !== newMember.id) return;
            m.EndLive();
            m.SetPosition(new Invalid());
            this.liveSpace.SetMember(i, null);
        });

        //指定した枠で配信しているメンバーは停止させる。
        var oldMember = this.liveSpace.space[index];
        if(oldMember !== null){
            oldMember.EndLive();
            oldMember.SetPosition(new Invalid());
            this.liveSpace.SetMember(index, null);
        }

        newMember.SetPosition(position);
        newMember.StartLive();
        this.liveSpace.SetMember(index, newMember);
    }

    public toString(){
        return `[MemberChanger:${this._remaining}]`;
    }

}

