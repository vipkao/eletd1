import { SaveData } from "Model/Element/SaveData";
import { IEnding, IEndingFactory } from "Model/interfaces";
import { EndingScene, EndingSceneImageKeys } from "../EndingScene";
import { IPhaserConfigFactory } from "../interfaces";

export class EndingFactory implements IEndingFactory{

    private readonly images: { [key in EndingSceneImageKeys]: string };
    private readonly phaserConfigFactory: IPhaserConfigFactory;

    constructor(
        images: { [key in EndingSceneImageKeys]: string },
        phaserConfigFactory: IPhaserConfigFactory
    ){
        this.images = images;
        this.phaserConfigFactory = phaserConfigFactory;
    }

    Create(saveData: SaveData): IEnding {
        if(saveData.subscribers >= 100000){
            return new EndingScene(
                saveData.subscribers,
                this.images["ending1"],
                this.phaserConfigFactory
            );    
        }else{
            return new EndingScene(
                saveData.subscribers,
                this.images["ending2"],
                this.phaserConfigFactory
            );                
        }
    }
}