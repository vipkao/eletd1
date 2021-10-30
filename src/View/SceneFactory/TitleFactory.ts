import { SaveData } from "Model/Element/SaveData";
import { ITitle, ITitleFactory } from "Model/interfaces";
import { PhaserGame } from "../PhaserGame";
import { TitleScene, TitleSceneImageKeys } from "../TitleScene";

export class TitleFactory implements ITitleFactory{

    private readonly images: { [key in TitleSceneImageKeys]: string };
    private readonly helpImages: string[];
    private readonly phaserGame: PhaserGame;

    constructor(
        images: { [key in TitleSceneImageKeys]: string },
        helpImages: string[],
        phaserGame: PhaserGame
    ){
        this.images = images;
        this.helpImages = helpImages;
        this.phaserGame = phaserGame;
    }

    Create(saveData: SaveData): ITitle {
        if(saveData.subscribers === 0){
            return new TitleScene(
                this.images, this.images["newButton"], this.helpImages,
                this.phaserGame
            );
        }else{
            return new TitleScene(
                this.images, this.images["continueButton"], this.helpImages,
                this.phaserGame
            );
        }

    }

}