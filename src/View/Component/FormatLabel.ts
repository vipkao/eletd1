import { IGameLayer } from "../interfaces";
import { Layer } from "./Layer";

/**
 * {0}{1}でフォーマットを指定できるラベル。
 */
export class FormatLabel implements IGameLayer{

    private readonly layer: Layer;

    private format: string = "";
    private values: (string | number)[] = [];

    private x: number = 0;
    private y: number = 0;

    private scene: Phaser.Scene | null = null;
    private phaserText : Phaser.GameObjects.Text | null = null;

    constructor(
        layer: Layer,
        x: number, y: number
    ){
        this.layer = layer;
        this.x = x;
        this.y = y;
    }

    SetScene(scene: Phaser.Scene): FormatLabel{
        this.scene = scene;
        return this;
    }

    Setting(callback: (text: Phaser.GameObjects.Text) => void): FormatLabel{
        if(this.scene === null) throw new Error("scene not set");
        if(this.phaserText === null){
            this.phaserText = this.Build();
        }
        callback(this.phaserText);
        return this;
    }

    SetPosition(x: number, y:number): FormatLabel{
        this.x = x;
        this.y = y;
        if(this.phaserText !== null){
            this.phaserText.setPosition(this.x, this.y);
        }
        return this;
    }

    SetValues(...values:(string | number)[]): FormatLabel{
        this.values = values;
        if(this.phaserText !== null){
            this.phaserText.setText(this.Convert());
        }
        return this;
    }

    SetFormat(format: string): FormatLabel{
        this.format = format;
        if(this.phaserText !== null){
            this.phaserText.setText(this.Convert());
        }
        return this;
    }

    Show(): FormatLabel{
        if(this.scene === null) throw new Error("container not set");
        if(this.phaserText === null){
            this.phaserText = this.Build();
        }
        this.phaserText.setText(this.Convert()).setVisible(true);
        return this;
    }

    Hide(): FormatLabel{
        if(this.scene === null) throw new Error("container not set");
        if(this.phaserText === null){
            this.phaserText = this.Build();
        }
        this.phaserText.setVisible(false);
        return this;
    }

    Destory(): void{
        this.phaserText?.destroy(true);
    }

    private Convert(): string{
        let ret = this.format;

        this.values.forEach((v, i) => {
            ret = ret.replace("{"+i+"}", v.toString());
        });

        return ret;
    }

    private Build(): Phaser.GameObjects.Text{
        if(this.scene === null) throw new Error("scene not set");
        const ret = new Phaser.GameObjects.Text(
            this.scene, this.x, this.y, "", {}
        ).setVisible(false);
        this.layer.Setting(l => l.add(ret));
        return ret;
    }


}