import { SaveData } from "Model/Element/SaveData";
import { ITitle, ITitleFactory } from "Model/interfaces";
import { PhaserGame } from "../PhaserGame";
import { TitleScene, TitleSceneImageKeys } from "../TitleScene";

export class TitleFactory implements ITitleFactory{

    private readonly images: { [key in TitleSceneImageKeys]: string };
    private readonly helpImages: string[];
    private readonly phaserGame: PhaserGame;
    private readonly buildDate: Date;

    constructor(
        images: { [key in TitleSceneImageKeys]: string },
        helpImages: string[],
        phaserGame: PhaserGame,
        buildDate: string
    ){
        this.images = images;
        this.helpImages = helpImages;
        this.phaserGame = phaserGame;
        this.buildDate = new Date(Date.parse(buildDate));
    }

    Create(saveData: SaveData): ITitle {
        const version = this.GetVersionString(this.buildDate);
        if(saveData.subscribers === 0){
            return new TitleScene(
                this.images, this.images["newButton"], this.helpImages,
                this.phaserGame,
                version
            );
        }else{
            return new TitleScene(
                this.images, this.images["continueButton"], this.helpImages,
                this.phaserGame,
                version
            );
        }

    }

    private GetVersionString(date: Date){
        const yyyy = date.getFullYear();
        const mo = ("00"+date.getMonth().toString()).slice(-2);
        const d = ("00"+date.getDay().toString()).slice(-2);
        const h = ("00"+date.getHours().toString()).slice(-2);
        const mi = ("00"+date.getMinutes().toString()).slice(-2);
        const s = ("00"+date.getSeconds().toString()).slice(-2);
        const ret = `${yyyy}${mo}${d}${h}${mi}${s}`;
        return ret;
    }

}