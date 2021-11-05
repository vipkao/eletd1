import { IGameLayer } from "../interfaces";
import { Layer } from "./Layer";

export class Blitter implements IGameLayer{

    private readonly layer: Layer;

    private scene: Phaser.Scene | null = null;
    private phaserBlitter : Phaser.GameObjects.Blitter | null = null;
    private phaserTextureAtlas : Phaser.Textures.Texture | null = null;

    private x: number;
    private y: number;
    private readonly atlasKey: string;

    constructor(
        layer: Layer,
        x: number, y:number,
        atlasKey: string
    ){
        this.layer = layer;
        this.x = x;
        this.y = y;
        this.atlasKey = atlasKey;
    }


    SetScene(scene: Phaser.Scene): Blitter {
        this.scene = scene;
        if(this.phaserBlitter === null){
            this.phaserBlitter = new Phaser.GameObjects.Blitter(
                this.scene,
                this.x, this.y,
                this.atlasKey
            ).setVisible(true);
            const _phaserBlitter = this.phaserBlitter;
            this.layer.Setting(l => l.add(_phaserBlitter));    
            this.phaserTextureAtlas = this.scene.textures.get(this.atlasKey);
        }
        return this;
    }

    Show(x: number, y: number, key: string, index?: number){
        if(this.phaserBlitter === null) return;
        this.phaserBlitter.create(x, y, key, true, index);
    }

    ShowByChar(text: string, lap: number){
        if(this.scene === null) throw new Error("scene not set");
        if(this.phaserTextureAtlas == null)
            throw new Error("phaserTextureAtlas not set");
        //nullcheck誤爆回避
        const _phaserTextureAtlas = this.phaserTextureAtlas;
        const charFrames = text.split("").map(n => {
            const ret = _phaserTextureAtlas.get(n);
            return ret;
        });    
        const drawFns:(() => void)[] = [];
        let x = 0;
        const BuildDrawFn = (x: number, key: string) => {
            return () => {this.phaserBlitter?.create(x, 0, key)};
        };
        charFrames.forEach((f, i) => {
            drawFns.push(BuildDrawFn(x, f.name));
            x += f.width - lap;
        });
    
        drawFns.reverse().forEach(fn => {
            fn();
        });
    
    }

    Clear(): Blitter{
        if(this.phaserBlitter === null) return this;
        this.phaserBlitter.children.getAll().forEach(b => {
            b.destroy();
        });
        this.phaserBlitter.clear();
        return this;
    }

    Destory(): void {
        if(this.phaserBlitter === null) return;
        this.phaserBlitter.children.getAll().forEach(b => {
            b.destroy();
        });
        this.phaserBlitter.destroy();        
    }
    
}