import { IPhaserConfigFactory } from "../interfaces";

export class SpFactory implements IPhaserConfigFactory{
    Create(): Phaser.Types.Core.GameConfig {
        const ret = {
            type: Phaser.AUTO,
            backgroundColor: '#EEEEEE',
            width: 1200,
            height: 800,
            scale: {
                mode: Phaser.Scale.FIT,
                width: 1200,
                height: 800
            }
        };
        return ret;
    }

}