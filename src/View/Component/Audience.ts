import { IGameLayer } from "../interfaces";
import { Layer } from "./Layer";

/**
 * ＴＤ部分で表示されるリスナー１人分の表示。
 */
export class Audience implements IGameLayer {

    private layer: Layer;

    private scene: Phaser.Scene | null = null;

    private container: Phaser.GameObjects.Container | null = null;

    private image: Phaser.GameObjects.Image | null = null;
    private goodImage: Phaser.GameObjects.Image | null = null;
    private listenImage: Phaser.GameObjects.Image | null = null;
    private satisfactionGauge: SatisfactionGauge | null = null;
    private satisfactionText: SatisfactionText | null = null;
    
    private readonly maxSatisfaction: number;
    private nowSatisfaction: number;
    private readonly image50Key: string;
    private readonly goodImageKey: string;
    private readonly listenImageKey: string;
    private readonly numberAtlasImageKey: string;

    constructor(
        layer: Layer,
        maxSatisfaction: number,
        image50Key: string,
        goodImageKey: string,
        listenImageKey: string,
        numberAtlasImageKey: string
    ){
        this.layer = layer;
        
        this.maxSatisfaction = maxSatisfaction;
        this.nowSatisfaction = 0;
        this.image50Key = image50Key;
        this.goodImageKey = goodImageKey;
        this.listenImageKey = listenImageKey;
        this.numberAtlasImageKey = numberAtlasImageKey;
    }

    SetScene(scene: Phaser.Scene): Audience{
        if(this.scene !== null) return this;

        this.scene = scene;

        const container = new Phaser.GameObjects.Container(
            this.scene, 0, 0
        ).setVisible(false);
        this.container = container;


        const image = new Phaser.GameObjects.Image(
            this.scene, 0, 0, this.image50Key
        );
        this.image = image;
        this.container.add(image);

        const listenImage = new Phaser.GameObjects.Image(
            this.scene, 0, 0, this.listenImageKey
        ).setVisible(false);
        this.listenImage = listenImage;
        this.container.add(listenImage);

        const goodImage = new Phaser.GameObjects.Image(
            this.scene, 0, 0, this.goodImageKey
        ).setVisible(false);
        this.goodImage = goodImage;
        this.container.add(goodImage);
        
        const satisfactionGauge = new SatisfactionGauge(
            this.maxSatisfaction,
            this.scene,
            this.container
        );
        this.satisfactionGauge = satisfactionGauge;
        this.satisfactionGauge.Change(0);

        this.layer.Setting(l => l.add(container));
        return this;
    }

    SetVisible(visible: boolean): Audience{
        this.container?.setVisible(visible).setActive(visible);
        return this;
    }

    SetPosition(x: number, y:number): Audience{
        this.container?.setPosition(x, y);
        return this;
    }

    SetListenVisible(visible: boolean): Audience{
        this.listenImage?.setVisible(visible);
        return this;
    }

    AddSatisfaction(count: number): Audience{
        if(this.scene === null) return this;
        if(this.container === null) return this;

        if(this.satisfactionText !== null){
            this.satisfactionText.Restart(count);
        }else{
            this.satisfactionText = new SatisfactionText(
                count, this.scene, this.container
            );    
        }
        //new SatisfactionImage(count, this.numberAtlasImageKey, this.scene, this.container);

        this.nowSatisfaction += count;
        this.satisfactionGauge?.Change(this.nowSatisfaction);

        return this;
    }

    ShowGood(): Audience{
        this.goodImage?.setVisible(true);
        this.listenImage?.setVisible(false);
        this.satisfactionGauge?.Hide();
        const imageTween = this.scene?.tweens.add({
            targets: this.image,
            ease: "Cubic.easeOut",
            duration: 2000,
            y:{ start: 0, to:10 },
            alpha: { start: 1, to: 0 },
            onComplete: () =>{
                imageTween?.stop();
                imageTween?.remove();
            }
        });
        const goodImageTween = this.scene?.tweens.add({
            targets: this.goodImage,
            duration: 2000,
            y: { start: -20, to: -40, ease: "Expo.easeOut" },
            alpha: { start: 1, to: 0, ease: "Expo.easeIn" },
            onComplete: () => {
                this.goodImage?.setVisible(false);
                this.container?.setVisible(false).setActive(false);
                goodImageTween?.stop();
                goodImageTween?.remove();
            }
        });
        return this;
    }
    
    Destory(): void{
        //ここもdestroy(true)をするとエラーになる。
        this.image?.destroy();
        this.goodImage?.destroy();
        this.listenImage?.destroy();
        this.satisfactionGauge?.Destroy();
        this.satisfactionText?.Destory();
        this.container?.destroy(true);
    }
}

class SatisfactionGauge{

    private readonly max: number;
    private readonly base: Phaser.GameObjects.Rectangle;
    private readonly fill: Phaser.GameObjects.Rectangle;
    private readonly container: Phaser.GameObjects.Container;

    constructor(
        max: number,
        scene: Phaser.Scene,
        container: Phaser.GameObjects.Container
    ){
        this.max = max;
        this.base = new Phaser.GameObjects.Rectangle(
            scene, -25, 20, 50, 5, 0x000000, 1
        ).setOrigin(0);
        this.fill = new Phaser.GameObjects.Rectangle(
            scene, -25, 20, 1, 5, 0x00FF00, 1
        ).setOrigin(0);
        container.add(this.base);
        container.add(this.fill);
        this.container = container;
    }

    Change(now: number){
        const ratio = now / this.max;
        this.fill.setSize(Math.ceil(50*ratio), 5);
    }

    Hide(){
        this.base.setVisible(false);
        this.fill.setVisible(false);
    }

    Destroy(){
        this.container.remove(this.base);
        this.container.remove(this.fill);
    }
}

/**
 * あまり早くないし、どういう訳か真っ黒になるタイミングがあるのでＮＧ。
 */
class SatisfactionImage{
    private readonly rt: Phaser.GameObjects.RenderTexture;
    private readonly tween: Phaser.Tweens.Tween;
    private readonly container: Phaser.GameObjects.Container;
    constructor(
        count: number,
        atlasImageKey: string,
        scene: Phaser.Scene,
        container: Phaser.GameObjects.Container
    ){
        this.rt = this.BuildNumberRenderTexture(count, atlasImageKey, scene);
        const x = Math.random()*20 - 25;
        const y = Math.random()*20 - 25;
        //const x = -5;
        //const y = -5;
        this.rt.setPosition(x, y);
        this.container = container;
        container.add(this.rt);
        this.tween = scene.tweens.add({
            targets: this.rt,
            duration: 1000,
            y:{ start: y, to:y-10, ease: "Expo.easeOut" },
            alpha: { start: 1, to: 0, ease: "Expo.easeIn" },
            onComplete: () => {
                this.tween.stop();
                this.tween.remove();
                this.container.remove(this.rt);
                this.rt.destroy();
            }
        });
    }

    private BuildNumberArray(count: number): string[]{
        const sign = count > 0 ? "+" : count < 0 ? "-" : "";
        const ret = (sign + count.toString()).split("");
        return ret;
    }

    private BuildNumberRenderTexture(
        count: number,
        atlasImageKey: string,
        scene: Phaser.Scene
    ): Phaser.GameObjects.RenderTexture{
        const numberArray = this.BuildNumberArray(count);
        const atlasTexture = scene.textures.get(atlasImageKey);
        const numberFrames = numberArray.map(n => {
            const ret = atlasTexture.get(n);
            return ret;
        });
        const lapWidth = 8;
        const totalWidth = numberFrames.map(f => f.width).reduce((a, b) => a+b) - (numberFrames.length - 1) * lapWidth;
        const ret = new Phaser.GameObjects.RenderTexture(scene, 0, 0, totalWidth, numberFrames[0].height);

        const drawFns:(() => void)[] = [];
        let x = 0;
        const BuildDrawFn = (x: number, key: string) => {
            return () => {ret.drawFrame(atlasImageKey, key, x, 0)};
        };
        numberFrames.forEach((f, i) => {
            drawFns.push(BuildDrawFn(x, f.name));
            x += f.width - lapWidth;
        });

        ret.beginDraw();
        drawFns.reverse().forEach(fn => {
            fn();
        });
        ret.endDraw();

        return ret;
    }

}
/**
 * 処理速度アップのために、Textを再利用するようにした。
 */
class SatisfactionText{
    private readonly text: Phaser.GameObjects.Text;
    private readonly tween: Phaser.Tweens.Tween;
    private readonly container: Phaser.GameObjects.Container;
    private nowCount: number = 0;
    constructor(
        count: number,
        scene: Phaser.Scene,
        container: Phaser.GameObjects.Container
    ){
        // const x = Math.random()*20 - 25;
        // const y = Math.random()*20 - 25;
        const x = -5;
        const y = -5;
        this.container = container;
        this.nowCount = count;
        //Textの生成は想像以上に重い模様。Canvas APIを使って描画しているから？
        this.text = new Phaser.GameObjects.Text(scene, x, y, "+"+count.toString(),{})
            .setColor("#000000").setFontSize(25).setStroke("#FFFFFF", 2)
            .setShadow(0, 0, "#FFFFFF", 3, true);
        container.add(this.text);
        this.tween = scene.tweens.add({
            targets: this.text,
            duration: 1000,
            y:{ start: y, to:y-10, ease: "Expo.easeOut" },
            alpha: { start: 1, to: 0, ease: "Expo.easeIn" },
            onComplete: () => {
                this.tween.stop();
            }
        });
    }

    Restart(count: number){
        // const x = Math.random()*10 - 15;
        // const y = Math.random()*10 - 15;
        const x = -5;
        const y = -5;
        if(this.nowCount === count){
            this.text.setPosition(x, y);
        }else{
            this.text.setText("+"+count.toString()).setPosition(x, y);
            this.nowCount = count;
        }
        this.tween.restart();
    }

    Destory(){
        this.tween.stop();
        this.tween.remove();
        this.container.remove(this.text);
        this.text.destroy();
        //tweenにdestroyはない
        //this.tween.destroy();
    }
}