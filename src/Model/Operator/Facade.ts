import { ILiveSpace, IMember, ISubscriber } from "../Element/interfaces";
import { SaveData } from "../Element/SaveData";
import { IDeltaServer } from "../Updater/TickDetector/interfaces";
import { EventEmitter, EventPort } from "../Utils/EventEmitter";
import { Concretes } from "./Concretes";
import { IMemberChanger, ISpeedChanger, IStageNexter, SpeedType } from "./interfaces";
import { PresetLimit } from "./MemberChanger/PresetLimit";
import { PresetDelta } from "./SpeedChanger/PresetDelta";
import { RetryBack } from "./StageNexter/RetryBack";

export class Facade{

    private readonly _speedChanger: ISpeedChanger;
    public get speedChanger() : ISpeedChanger{
        return this._speedChanger;
    }

    private readonly _memberChanger: IMemberChanger;
    public get memberChanger() : IMemberChanger{
        return this._memberChanger;
    }

    private readonly _stageNexter: IStageNexter;
    public get stageNexter() : IStageNexter{
        return this._stageNexter;
    }


    private readonly event : EventEmitter;


    constructor(
        normalDelta: number,
        highDelta: number,
        defaultSpeed: SpeedType,
        defaultStop: boolean,
        memberChangeLimit: number,
        liveSpace: ILiveSpace,
        subscriber: ISubscriber,
        saveData: SaveData
    ){
        this._speedChanger = new PresetDelta(
            normalDelta,
            highDelta,
            defaultSpeed,
            defaultStop
        );

        this._memberChanger = new PresetLimit(
            memberChangeLimit,
            liveSpace
        );

        this._stageNexter = new RetryBack(
            subscriber,
            saveData
        );

        this.event = new EventEmitter();
    }

    public toString(){
        return `[${this.speedChanger},${this.memberChanger}]`;
    }
}