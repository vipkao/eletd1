import "phaser";

export class PhaserScene extends Phaser.Scene{

    public readonly config;

    private readonly _preload: (phaserScene: PhaserScene) => void;
    private readonly _create: (phaserScene: PhaserScene) => void;
    private readonly _update: (phaserScene: PhaserScene) => void;
    
    constructor(
        name: string,
        preload: (phaserScene: PhaserScene) => void,
        create: (phaserScene: PhaserScene) => void,
        update: (phaserScene: PhaserScene) => void,
    ){
        super(name);

        this._preload = preload;
        this._create = create;
        this._update = update;
        
        this.config = {
            type: Phaser.AUTO,
            backgroundColor: '#EEEEEE',
            width: 1200,
            height: 800,
            scene: this
        };
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