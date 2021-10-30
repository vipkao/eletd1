import { IGameLayer } from "../interfaces";
import { Layer } from "./Layer";

/**
 * 画像を表示する実装。
 * width/heightを指定するが、これは左上指定の為であって、表示サイズを指定するものではない。
 * width/heightを両方とも0を指定すると、センタリングされる。
 */
export class Image implements IGameLayer{

    private readonly layer: Layer;

    private scene: Phaser.Scene | null = null;
    private phaserImage : Phaser.GameObjects.Image | null = null;

    private x: number;
    private y: number;
    private readonly width: number;
    private readonly height: number;
    private readonly imageKey: string;

    constructor(
        layer: Layer,
        x: number, y:number,
        width: number, height: number,
        imageKey: string
    ){
        this.layer = layer;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageKey = imageKey;
    }

    SetScene(scene: Phaser.Scene): Image{
        this.scene = scene;
        if(this.phaserImage === null){
            this.phaserImage = this.Build();
        }
        return this;
    }

    SetPosition(x: number, y: number) : Image{
        if(this.phaserImage === null){
            this.phaserImage = this.Build();
        }
        this.x = x;
        this.y = y;
        this.phaserImage.setPosition(
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        return this;
    }

    Setting(callback: (image: Phaser.GameObjects.Image) => void): Image{
        if(this.phaserImage === null){
            this.phaserImage = this.Build();
        }
        callback(this.phaserImage);
        return this;
    }

    Destory(): void{
        this.phaserImage?.destroy(true);
    }

    private Build(): Phaser.GameObjects.Image{
        if(this.scene === null) throw new Error("scene not set");
        const ret = new Phaser.GameObjects.Image(
            this.scene,
            this.x + this.width/2, this.y + this.height/2,
            this.imageKey
        ).setVisible(true);
        this.layer.Setting(l => l.add(ret));
        return ret;
    }

}