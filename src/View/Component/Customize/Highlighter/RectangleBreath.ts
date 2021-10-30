import { IHighlighter } from "../../interfaces";

export class RectangleBreath implements IHighlighter{

    private readonly color: number;
    private readonly alpha: number;
    private readonly addAt: number;

    private rectangle: Phaser.GameObjects.Rectangle | null = null;
    private tween: Phaser.Tweens.Tween | null = null;
    private isStop: boolean = false;

    constructor(
        color: number, alpha: number, addAt: number
    ){
        this.color = color;
        this.alpha = alpha;
        this.addAt = addAt;
    }

    
    SetScene(scene: Phaser.Scene, parent: Phaser.GameObjects.Container): void {
        this.rectangle = new Phaser.GameObjects.Rectangle(
            scene,
            0, 0, parent.width, parent.height,
            this.color, 1
        ).setOrigin(0.5).setVisible(!this.isStop);
        parent.addAt(this.rectangle, this.addAt);
        this.tween = scene.tweens.add({
            targets: this.rectangle,
            ease: "Sine.easeInOut",
            duration: 1200,
            loop: -1,
            yoyo: true,
            //理由は分からないが、pauseするとplayで復帰できない。
            //paused: this.isStop,
            alpha: { start: 0, to: this.alpha }
        });
        if(this.isStop) this.tween.stop();
    }
    Start(): void {
        this.isStop = false;
        this.rectangle?.setVisible(true);
        this.tween?.play();
    }
    Stop(): void {
        this.isStop = true;
        this.rectangle?.setVisible(false);
        this.tween?.stop();
    }
    Destory(): void {
        //rectangleはdestory(true)をすると内部でエラーになる。
        this.rectangle?.destroy();
        this.tween?.stop();
        this.tween?.remove();
    }

}