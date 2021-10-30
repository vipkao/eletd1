import "phaser";

export class PhaserScene extends Phaser.Scene{

    readonly name: string;

    private readonly _preload: (phaserScene: PhaserScene) => void;
    private readonly _create: (phaserScene: PhaserScene) => void;
    private readonly _update: (phaserScene: PhaserScene) => void;

    constructor(
        name: string,
        preload: (phaserScene: PhaserScene) => void,
        create: (phaserScene: PhaserScene) => void,
        update: (phaserScene: PhaserScene) => void
    ){
        super(name);

        this.name = name;
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