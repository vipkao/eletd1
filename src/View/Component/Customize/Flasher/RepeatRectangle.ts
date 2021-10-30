import { EventEmitter, EventPort } from "Model/Utils/EventEmitter";
import { IFlasher } from "../../interfaces";

export class RepeatRectangle implements IFlasher{

    private readonly event : EventEmitter;
    private readonly _onFlashEnded : EventPort<() => void>;
    get OnFlashEnded(): EventPort<() => {}> { return this._onFlashEnded; }

    private readonly color: number;
    private readonly alpha: number;
    private readonly repeat: number;
    private readonly duration: number;
    private readonly addAt: number;

    private rectangle: Phaser.GameObjects.Rectangle | null = null;
    private tween: Phaser.Tweens.Tween | null = null;

    constructor(
        color: number, alpha: number, repeat: number, duration: number, addAt: number
    ){
        this.event = new EventEmitter();
        this._onFlashEnded = new EventPort("OnFlashEnded", this.event);

        this.color = color;
        this.alpha = alpha;
        this.repeat = repeat;
        this.duration = duration;
        this.addAt = addAt;

    }


    SetScene(scene: Phaser.Scene, parent: Phaser.GameObjects.Container): void {
        this.rectangle = new Phaser.GameObjects.Rectangle(
            scene,
            0, 0, parent.width, parent.height,
            this.color, 1
        ).setOrigin(0.5).setVisible(false);
        parent.addAt(this.rectangle, this.addAt);

        this.tween = scene.tweens.add({
            targets: this.rectangle,
            ease: "Sine.easeInOut",
            duration: this.duration,
            loop: this.repeat,
            yoyo: true,
            paused: true,
            alpha: { start: 0, to: this.alpha },
            onComplete: () => {
                this.rectangle?.setVisible(false);
                this.event.emit(this._onFlashEnded);
            }
        });

    }
    Start(): void {
        this.rectangle?.setVisible(true);
        this.tween?.play();
    }
    Destory(): void {
        this._onFlashEnded.removeAllListeners();
        //rectangleはdestory(true)をすると内部でエラーになる。
        this.rectangle?.destroy();
        this.tween?.stop();
        this.tween?.remove();
    }

}