import { PhaserScene } from "./PhaserScene";

export type DEVICE_TYPE = "pc" | "sp";

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
    private prevScene: PhaserScene | null = null;
    
    constructor(
        config: Phaser.Types.Core.GameConfig
    ){
        this.game = new Phaser.Game(config);
    }

    Switch(newScene: PhaserScene){
        this.game.scene.add(newScene.name, newScene);
        this.game.scene.run(newScene.name);
        console.log("start:"+newScene.name);
        if(this.prevScene !== null){
            this.game.scene.stop(this.prevScene.name);
            this.game.scene.remove(this.prevScene.name);
            console.log("stop:"+this.prevScene.name);
        }
        this.prevScene = newScene;
        
    }

    static GetConfig(device: DEVICE_TYPE) : Phaser.Types.Core.GameConfig{
        if(device === "pc") return this.PC_CONFIG;
        if(device === "sp") return this.SP_CONFIG;
        throw new Error("not support:"+device);
    }


}