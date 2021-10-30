import { PlaySceneFacade as Model } from "Model/PlaySceneFacade";
import { StageEnd } from "./StargeEnd";

/**
 * 目標達成ならずでクリアした時の画面。
 */
export class StageFailEnd extends StageEnd{
    constructor(
        model: Model,
        headerImageKey: string,
        nextImageKey: string,
        retryImageKey: string,
        titleImageKey: string,
    ){
        super(model, headerImageKey, nextImageKey, retryImageKey, titleImageKey, scene => {
            model.tick.OnFailEnded.on(() => {
                this.Show();
            });
        });
    }

}