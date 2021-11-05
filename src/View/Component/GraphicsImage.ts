import { IGameLayer } from "../interfaces";
import { Layer } from "./Layer";

/**
 * Graphicsに描画した画像をImageに貼り付けて画像とする実装。
 * width/heightを指定するが、これは左上指定の為であって、表示サイズを指定するものではない。
 * width/heightを両方とも0を指定すると、センタリングされる。
 */
export class GraphicsImage implements IGameLayer{

    private readonly layer: Layer;

    private x: number;
    private y: number;
    private readonly width: number;
    private readonly height: number;
    private textureKey: string = "";

    private scene: Phaser.Scene | null = null;
    private phaserGraphics : Phaser.GameObjects.Graphics | null = null;
    private phaserImage : Phaser.GameObjects.Image | null = null;

    get g(): Phaser.GameObjects.Graphics{
        if(this.phaserGraphics === null) throw new Error("graphics");
        return this.phaserGraphics;
    }
    get image(): Phaser.GameObjects.Image{
        if(this.phaserImage === null) throw new Error("image");
        return this.phaserImage;
    }

    constructor(
        layer: Layer,
        x: number, y:number,
        width: number, height: number,
    ){

        this.layer = layer;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    SetScene(scene: Phaser.Scene): GraphicsImage{
        this.scene = scene;
        if(this.phaserGraphics === null){
            this.phaserGraphics = this.BuildGraphics();
        }
        if(this.phaserImage === null){
            this.phaserImage = this.BuildImage();
        }
        this.Update();
        return this;
    }

    SettingGraphics(callback: (g: Phaser.GameObjects.Graphics) => void): GraphicsImage{
        if(this.phaserGraphics === null){
            this.phaserGraphics = this.BuildGraphics();
        }
        callback(this.phaserGraphics);
        return this;
    }

    SettingImage(callback: (image: Phaser.GameObjects.Image) => void): GraphicsImage{
        if(this.phaserImage === null){
            this.phaserImage = this.BuildImage();
        }
        callback(this.phaserImage);
        return this;
    }

    SetPosition(x: number, y: number) : GraphicsImage{
        if(this.phaserImage === null){
            this.phaserImage = this.BuildImage();
        }
        this.x = x;
        this.y = y;
        this.phaserImage.setPosition(
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        return this;
    }

    Destory(): void{
        this.phaserGraphics?.destroy(true);
        this.phaserImage?.destroy(true);
    }

    private BuildGraphics(): Phaser.GameObjects.Graphics{
        if(this.scene === null) throw new Error("scene not set");
        const ret = new Phaser.GameObjects.Graphics(
            this.scene
        ).setVisible(false);
        //負荷軽減のため、visibleはfalseにし、layerにはaddしない。
        return ret;
    }
    private BuildImage(): Phaser.GameObjects.Image{
        if(this.scene === null) throw new Error("scene not set");
        const ret = new Phaser.GameObjects.Image(
            this.scene,
            this.x + this.width/2, this.y + this.height/2,
            this.textureKey
        ).setVisible(true);
        this.layer.Setting(l => l.add(ret));
        return ret;
    }

    Update(){
        if(this.scene === null) throw new Error("scene not set");
        if(this.phaserGraphics === null) throw new Error("graphics");
        if(this.phaserImage === null) throw new Error("image");

        if(this.textureKey !== ""){
            this.scene.textures.get(this.textureKey).destroy();
        }else{
            this.textureKey = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
            console.log(this.textureKey);    
        }

        this.phaserGraphics.generateTexture(
            this.textureKey, this.width, this.height
        );
        this.phaserImage.setTexture(this.textureKey);
    }

}