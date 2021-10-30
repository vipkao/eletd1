import { PhaserScene } from "./PhaserScene";

export type DEVICE_TYPE = "pc" | "sp";

/**
 * Phaser.gameを使いまわせるようにした実装。
 * Phaser.gameを使いまわすことで、おそらくメモリーリーク的なのがかなり軽減された。
 */
export class PhaserGame{

    static PC_CONFIG = {
        type: Phaser.AUTO,
        backgroundColor: '#EEEEEE',
        width: 1200,
        height: 800
    };

    static SP_CONFIG = {
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



    public readonly game: Phaser.Game;
    private prevKey: string = "";
    
    constructor(
        config: Phaser.Types.Core.GameConfig
    ){
        this.game = new Phaser.Game(config);
    }

    Switch(newScene: PhaserScene){
        this.game.scene.add(newScene.key, newScene);
        this.game.scene.run(newScene.key);
        if(this.prevKey !== ""){
            this.game.scene.stop(this.prevKey);
            this.game.scene.remove(this.prevKey);
        }
        this.prevKey = newScene.key;
        
    }

    static GetConfig(device: DEVICE_TYPE) : Phaser.Types.Core.GameConfig{
        if(device === "pc") return this.PC_CONFIG;
        if(device === "sp") return this.SP_CONFIG;
        throw new Error("not support:"+device);
    }


}