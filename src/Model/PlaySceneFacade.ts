import { FullCustom as Audience } from "./Element/Audience/FullCustom";
import { Factory as MoveRouteFactory } from "./Element/Audience/MoveRoute/Factory";
import { Audiences } from "./Element/Audiences";
import { Facade as ElementFacade } from "./Element/Facade";
import { LiveTaste } from "./Element/LiveTaste";
import { FullCustom as Member } from "./Element/Member/FullCustom";
import { Factory as ListenDetectorFactory } from "./Element/Member/ListenDetector/Factory";
import { Members } from "./Element/Members";
import { Facade as TickFacade } from "./Tick/Facade";
import { Facade as OperatorFacade } from "./Operator/Facade";
import { SpeedType } from "./Operator/interfaces";
import { Facade as updaterFacade } from "./Updater/Facade";
import { IMillisecondServer } from "./Updater/interfaces";
import { UseGetTime } from "./Updater/MillisecondServer/UseGetTime";
import { SaveData } from "./Element/SaveData";

/**
 * TD中の機能を纏めたfacade。
 */
export class PlaySceneFacade{

    public readonly element : ElementFacade;
    public readonly operator : OperatorFacade;
    public readonly tick : TickFacade;
    public readonly updater: updaterFacade;

    constructor(
        maxLiveSpace: number,
        initialSubscriber: number,
        targetSubscriber: number,
        normalSpeedTimeDelta: number,
        highSpeedTimeDelta: number,
        defaultSpeed: SpeedType,
        defaultStop: boolean,
        memberChangeLimit: number,
        members: Members,
        audiences: Audiences,
        saveData: SaveData,
        millisecondServer: IMillisecondServer
    ){
        this.element = new ElementFacade(
            maxLiveSpace,
            initialSubscriber, targetSubscriber,
            members, audiences    
        );

        this.tick = new TickFacade(
            audiences, members, this.element.subscriber
        );

        this.operator = new OperatorFacade(
            normalSpeedTimeDelta,
            highSpeedTimeDelta,
            defaultSpeed,
            defaultStop,
            memberChangeLimit,
            this.element.liveSpace,
            this.element.subscriber,
            saveData
        );

        this.updater = new updaterFacade(
            millisecondServer,
            this.tick.tickWorker
        );

        this.updater.SetDelta(this.operator.speedChanger.nowDelta);
        this.operator.speedChanger.OnDeltaChanged.on(delta => {
            this.updater.SetDelta(delta);
        })
        this.element.audiences.all.forEach(a => {
            a.OnSubscribed.on((_, s) => {
                this.element.subscriber.Add(s);
            });
            a.OnDisappointed.on((_, s) => {
                this.element.subscriber.Add(-s);
            });
        });
    }

    static CreateDefaultMillisecondServer(): IMillisecondServer{
        return new UseGetTime();
    }

    /**
     * ルートがPtPで配信内容性向はTypeAのリスナーを作る。
     * 作られる順序はpersonalitiesの順になる。
     * @param scoreTemplate { "key":[initListenTick, maxSatisfaction, subscribedScore, disappointedScore, [[good, week], [good, week…]] ], "key":[…] }
     * @param routeTemplate { "key":[moveEnd, [[x1, y1, startp1, speed1],…] ], "key":[…] }
     * @param personalities  [ ["imageKey", "scoreKey", "routeKey", moveWait] ]
     */
    static CreateAudiencePtpTypeA(
        scoreTemplate: {[key:string]: (number | number[][])[]},
        routeTemplate:  {[key:string]: (number | number[][])[]},
        personalities: (string | number)[][]
    ): Audiences{
        const audiences = new Audiences(
            personalities.map((p, id) => {
                const scoreKey = p[1] as string;
                const routeKey = p[2] as string;
                const moveWait = p[3] as number;

                const scoreSet = scoreTemplate[scoreKey];
                const initListenTick = scoreSet[0] as number;
                const maxSatisfaction = scoreSet[1] as number;
                const subscribedScore = scoreSet[2] as number;
                const disappointedScore = scoreSet[3] as number;
                const tastes = scoreSet[4] as number[][];
                const taste = LiveTaste.CreateTypeA(tastes);

                const routeSet = routeTemplate[routeKey];
                const moveEnd = routeSet[0] as number;
                const routes = routeSet[1] as number[][];
                const route = MoveRouteFactory.CreateFromMultiPoint(routes);

                const ret = new Audience(
                    id, initListenTick, maxSatisfaction,
                    subscribedScore, disappointedScore,
                    moveWait, moveEnd,
                    route,
                    taste
                );
                return ret;
            })    
        );
        return audiences;
    }

    /**
     * 配信内容性向がTypeAのメンバーを作る。
     * 作られる順はappearMembersの順となる。
     * @param template {"name":[[good,weak],…]], "name":[]}
     * @param appearMembers [ ["name", "liveAreaShape", [shapeParam,…]],… ]
     */
    static CreateMemberTypeA(
        template:{ [key:string]:(number[][])[] },
        appearMembers: (string | number[] | number[][])[][]
    ): Members{
        const members = new Members(
            appearMembers.map((p, id) => {
                const name = p[0] as string;
                const shapeType = p[1] as string;
                const shapeParams = p[2] as number[];
                const detector = this.GetDetector(shapeType, shapeParams);
                const overTastes = p[3] as number[][];
                if(overTastes == null){
                    const config = template[name];
                    const tastes = config[0] as number[][];
                    const taste = LiveTaste.CreateTypeA(tastes);
                    const ret = new Member(id, name, detector, taste);
                    return ret;    
                }else{
                    const taste = LiveTaste.CreateTypeA(overTastes);
                    const ret = new Member(id, name, detector, taste);
                    return ret;    
                }

            })    
        );
        return members;
    }
    private static GetDetector(shapeType: string, shapeParams: number[]){
        if(shapeType === "c"){
            const radius = shapeParams[0];
            const detector = ListenDetectorFactory.CreateFromRadius(radius);    
            return detector;
        }else{
            throw new Error("not support:"+shapeType);
        }
    }

}