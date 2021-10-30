import { SaveData } from "Model/Element/SaveData";
import { ITitle, ITitleFactory } from "Model/interfaces";
import { IPhaserConfigFactory } from "../interfaces";
import { TitleScene, TitleSceneImageKeys } from "../TitleScene";

export class TitleFactory implements ITitleFactory{

    private readonly images: { [key in TitleSceneImageKeys]: string };
    private readonly helpImages: string[];
    private readonly phaserConfigFactory: IPhaserConfigFactory;

    constructor(
        images: { [key in TitleSceneImageKeys]: string },
        helpImages: string[],
        phaserConfigFactory: IPhaserConfigFactory
    ){
        this.images = images;
        this.helpImages = helpImages;
        this.phaserConfigFactory = phaserConfigFactory;
    }

    Create(saveData: SaveData): ITitle {
        if(saveData.subscribers === 0){
            return new TitleScene(
                this.images, this.images["newButton"], this.helpImages,
                this.phaserConfigFactory
            );
        }else{
            return new TitleScene(
                this.images, this.images["continueButton"], this.helpImages,
                this.phaserConfigFactory
            );
        }

    }

}