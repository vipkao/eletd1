import { SaveData } from "Model/Element/SaveData";
import { IEnding, IEndingFactory } from "Model/interfaces";
import { EndingScene, EndingSceneImageKeys } from "../EndingScene";
import { PhaserGame } from "../PhaserGame";

export class EndingFactory implements IEndingFactory{

    private readonly images: { [key in EndingSceneImageKeys]: string };
    private readonly phaserGame: PhaserGame;

    constructor(
        images: { [key in EndingSceneImageKeys]: string },
        phaserGame: PhaserGame
    ){
        this.images = images;
        this.phaserGame = phaserGame;
    }

    Create(saveData: SaveData): IEnding {
        if(saveData.subscribers >= 100000){
            return new EndingScene(
                saveData.subscribers,
                this.images["ending1"],
                this.phaserGame
            );    
        }else{
            return new EndingScene(
                saveData.subscribers,
                this.images["ending2"],
                this.phaserGame
            );                
        }
    }
}