import { SaveData } from "Model/Element/SaveData";
import { ITitle, ITitleFactory } from "Model/interfaces";
import { TitleScene, TitleSceneImageKeys } from "../TitleScene";

export class TitleFactory implements ITitleFactory{

    private readonly images: { [key in TitleSceneImageKeys]: string };
    private readonly helpImages: string[];

    constructor(
        images: { [key in TitleSceneImageKeys]: string },
        helpImages: string[]
    ){
        this.images = images;
        this.helpImages = helpImages;
    }

    Create(saveData: SaveData): ITitle {
        if(saveData.subscribers === 0){
            return new TitleScene(
                this.images, this.images["newButton"], this.helpImages
            );
        }else{
            return new TitleScene(
                this.images, this.images["continueButton"], this.helpImages
            );
        }

    }

}