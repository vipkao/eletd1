import "phaser";

export class PhaserScene extends Phaser.Scene{

    readonly key: string;

    private readonly _preload: (phaserScene: PhaserScene) => void;
    private readonly _create: (phaserScene: PhaserScene) => void;
    private readonly _update: (phaserScene: PhaserScene) => void;

    constructor(
        preload: (phaserScene: PhaserScene) => void,
        create: (phaserScene: PhaserScene) => void,
        update: (phaserScene: PhaserScene) => void
    ){
        //毎回シーンは削除しているので、同じシーンを使いまわすとき、
        //キーの重複的な問題かでエラーになるので、毎回ランダム。
        const key = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        super(key);

        this.key = key;
        this._preload = preload;
        this._create = create;
        this._update = update;
    }

    preload(){
        this._preload(this);
    }

    create(){
        this._create(this);
    }

    update(){
        this._update(this);
    }

}