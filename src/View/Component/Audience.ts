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
    private satisfactionGauge: Phaser.GameObjects.Graphics | null = null;
    private satisfactionText: SatisfactionText | null = null;
    
    private readonly maxSatisfaction: number;
    private nowSatisfaction: number;
    private readonly image50Key: string;
    private readonly goodImageKey: string;
    private readonly listenImageKey: string;

    constructor(
        layer: Layer,
        maxSatisfaction: number,
        image50Key: string,
        goodImageKey: string,
        listenImageKey: string,
    ){
        this.layer = layer;
        
        this.maxSatisfaction = maxSatisfaction;
        this.nowSatisfaction = 0;
        this.image50Key = image50Key;
        this.goodImageKey = goodImageKey;
        this.listenImageKey = listenImageKey;
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
        
        const satisfactionGauge = new Phaser.GameObjects.Graphics(
            this.scene
        );
        this.satisfactionGauge = satisfactionGauge;
        this.container.add(satisfactionGauge);
        this.UpdateSatisfactionGauge();

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

        this.nowSatisfaction += count;
        this.UpdateSatisfactionGauge();

        return this;
    }

    ShowGood(): Audience{
        this.goodImage?.setVisible(true);
        this.listenImage?.setVisible(false);
        this.satisfactionGauge?.setVisible(false);
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
        this.satisfactionGauge?.destroy();
        this.satisfactionText?.Destory();
        this.container?.destroy(true);
    }

    private UpdateSatisfactionGauge(){
        const ratio = this.nowSatisfaction / this.maxSatisfaction;
        this.satisfactionGauge?.clear()
            .fillStyle(0x00FF00, 1).fillRect(-25, 20, 50*ratio, 5)
            .fillStyle(0x000000, 1).fillRect(-25+50*ratio, 20, 50-50*ratio, 5)
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