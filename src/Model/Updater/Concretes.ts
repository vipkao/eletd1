import { IMillisecondServer, ITickWorker } from "./interfaces";
import { UseGetTime } from "./MillisecondServer/UseGetTime";

/**
 * Facadeの実装に必要な機能の一式。
 */
export class Concretes{
    public millisecondServer: IMillisecondServer;
    public additionalWorkers: ITickWorker[];

    constructor(){
        this.millisecondServer = new UseGetTime();
        this.additionalWorkers = [];
    }
}