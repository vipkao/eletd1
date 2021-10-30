import { IGameLayer } from "../interfaces";
import { Layer } from "./Layer";

/**
 * 線とか円を描画する実装。
 * 注意！！広範囲に描画する場合は、めちゃくちゃに重くなるので注意。おそらくupdate毎に再描画していると思われる。
 * 広範囲に描画する場合は、GraphicsImageを使用すること。
 */
export class Graphics implements IGameLayer{

    private readonly layer: Layer;

    private scene: Phaser.Scene | null = null;
    private phaserGraphics : Phaser.GameObjects.Graphics | null = null;

    get g(): Phaser.GameObjects.Graphics{
        if(this.phaserGraphics === null){
            this.phaserGraphics = this.Build();
        }
        return this.phaserGraphics;
    }

    constructor(
        layer: Layer
    ){

        this.layer = layer;
    }

    SetScene(scene: Phaser.Scene): Graphics{
        this.scene = scene;
        if(this.phaserGraphics === null){
            this.phaserGraphics = this.Build();
        }
        return this;
    }

    Setting(callback: (g: Phaser.GameObjects.Graphics) => void): Graphics{
        if(this.phaserGraphics === null){
            this.phaserGraphics = this.Build();
        }
        callback(this.phaserGraphics);
        return this;
    }

    Destory(): void{
        this.phaserGraphics?.destroy(true);
    }

    private Build(): Phaser.GameObjects.Graphics{
        if(this.scene === null) throw new Error("scene not set");
        const ret = new Phaser.GameObjects.Graphics(
            this.scene
        ).setVisible(true);
        this.layer.Setting(l => l.add(ret));
        return ret;
    }

}