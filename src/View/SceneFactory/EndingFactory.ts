import { SaveData } from "Model/Element/SaveData";
import { IEnding, IEndingFactory } from "Model/interfaces";
import { EndingScene, EndingSceneImageKeys } from "../EndingScene";

export class EndingFactory implements IEndingFactory{

    private readonly images: { [key in EndingSceneImageKeys]: string };

    constructor(
        images: { [key in EndingSceneImageKeys]: string },

    ){
        this.images = images;
    }

    Create(saveData: SaveData): IEnding {
        if(saveData.subscribers >= 100000){
            return new EndingScene(
                saveData.subscribers,
                this.images["ending1"]
            );    
        }else{
            return new EndingScene(
                saveData.subscribers,
                this.images["ending2"]
            );                
        }
    }
}