import { PhaserScene } from "./PhaserScene";

/**
 * ゲーム画面で使用するために各種コンポーネントが纏められたレイヤーの機能。
 */
export interface IGameLayer {
    SetScene(scene: Phaser.Scene): void;
    Destory(): void;
}

/**
 * メンバーの配信範囲を描画する機能。
 */
export interface ILiveAreaDrawer{
    Fill(x: number, y:number, graphics: Phaser.GameObjects.Graphics): Phaser.GameObjects.Graphics;
    Stroke(x: number, y:number, graphics: Phaser.GameObjects.Graphics): Phaser.GameObjects.Graphics;
}
