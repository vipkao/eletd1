import { IGameLayer } from "../interfaces";

export class Layer implements IGameLayer{

    private scene: Phaser.Scene | null = null;
    private phaserLayer : Phaser.GameObjects.Layer | null = null;

    private readonly name: string;

    constructor(
        name? : string
    ){
        this.name = name ?? "";
    }

    SetScene(scene: Phaser.Scene): Layer{
        this.scene = scene;
        if(this.phaserLayer === null){
            this.phaserLayer = this.Build();
        }
        return this;
    }

    Setting(callback: (layer: Phaser.GameObjects.Layer) => void): Layer{
        if(this.phaserLayer === null){
            this.phaserLayer = this.Build();
        }
        callback(this.phaserLayer);
        return this;
    }

    Destory(): void{
        this.phaserLayer?.destroy();
    }

    private Build(): Phaser.GameObjects.Layer{
        if(this.scene === null) throw new Error("scene not set");
        const layer = new Phaser.GameObjects.Layer(this.scene);
        this.scene.add.existing(layer);
        return layer;
    }

    public toString(){
        return `Layer[${this.name}]`;
    }

}