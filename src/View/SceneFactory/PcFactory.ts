import { IPhaserConfigFactory } from "../interfaces";

export class PcFactory implements IPhaserConfigFactory{
    Create(): Phaser.Types.Core.GameConfig {
        const ret = {
            type: Phaser.AUTO,
            backgroundColor: '#EEEEEE',
            width: 1200,
            height: 800
        };
        return ret;
    }

}