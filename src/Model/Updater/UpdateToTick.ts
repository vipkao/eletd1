import { IMillisecondServer, ITickDetector, ITickWorker } from "./interfaces";

/**
 * ゲームループなどのupdateを特定間隔で実行されるtickに変換する実装。
 */
    export class UpdateToTick{

    private timeServer : IMillisecondServer;
    private detector : ITickDetector;
    private worker : ITickWorker;

    private tick : number;

    constructor(
        timeServer : IMillisecondServer,
        detector : ITickDetector,
        worker : ITickWorker
    ){
        this.timeServer = timeServer;
        this.detector = detector;
        this.worker = worker;       
        this.tick = 0;     
    }

    public Do(){
        const time = this.timeServer.Serve();
        if(this.detector.NeedWork(time)){
            this.worker.Do(this.tick);
            this.tick++;
        }
    }

}
