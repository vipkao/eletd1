import { FullCustom as Audience_FullCustom } from "./Audience/FullCustom";
import { Audiences } from "./Audiences";
import { ILiveSpace, IPosition, ISubscriber } from "./interfaces";
import { PresetMax } from "./LiveSpace/PresetMax";
import { LiveTaste } from "./LiveTaste";
import { FullCustom as Member_FullCustom } from "./Member/FullCustom";
import { Members } from "./Members";
import { Preset } from "./Subscriber/Preset";
import { Preset as Position } from "../Element/Position/Preset";
import { Factory as MoveRouteFactory } from "./Audience/MoveRoute/Factory";
import { Factory as ListenDetectorFactory } from "./Member/ListenDetector/Factory";

export class Facade{

    public audiences: Audiences;
    public members: Members;
    public subscriber: ISubscriber;
    public liveSpace: ILiveSpace;

    constructor(
        maxLiveSpace: number,
        initialSubscriber: number,
        targetSubscriber: number,
        members: Members,
        audiences: Audiences
    ){

        this.subscriber = new Preset(initialSubscriber, targetSubscriber);
        this.liveSpace = new PresetMax(maxLiveSpace);
        this.members = members;
        this.audiences = audiences;

   }

}