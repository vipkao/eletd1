import { PlayScene } from "View/PlayScene";
import { PlaySceneFacade } from "Model/PlaySceneFacade";
import { IEnding, IEndingFactory, IPlayStage, IPlayStageFactory, ITitle, ITitleFactory } from "./interfaces";
import { SaveData } from "./Element/SaveData";

export class StageDirector{


    private plyaing : IPlayStage | null = null;
    private plyaingIndex : number = -1;

    private readonly titleFactory: ITitleFactory;
    private readonly stageFactories: IPlayStageFactory[];
    private readonly endingFactory: IEndingFactory;

    constructor(
        titleFactory: ITitleFactory,
        stageFactories: IPlayStageFactory[],
        endingFactory: IEndingFactory
    ){
        this.titleFactory = titleFactory;
        this.stageFactories = stageFactories;
        this.endingFactory = endingFactory;
    }

    StartTitle(saveData: SaveData){
        const title = this.titleFactory.Create(saveData);

        title.OnStageSelected.on((index: number) => {
            title.Destroy();
            this.StartStage(index, saveData);    
        });

        title.Start(saveData);
    }

    StartStage(index: number, saveData: SaveData){
        this.plyaing = this.stageFactories[index].Create(saveData);
        this.plyaingIndex = index;

        this.plyaing.OnNextStage.on(saveData =>{
            if(this.plyaing !== null){
                this.plyaing.Destroy();
                this.plyaing = null;    
            }
    
            if(this.stageFactories.length - 1 === this.plyaingIndex){
                this.StartEnding(saveData);
                return;
            }
            this.StartStage(this.plyaingIndex + 1, saveData);    
        });
        this.plyaing.OnRetryStage.on(saveData=>{
            if(this.plyaing !== null){
                this.plyaing.Destroy();
                this.plyaing = null;    
            }
    
            this.StartStage(this.plyaingIndex, saveData);    
        });
        this.plyaing.OnGoTitle.on(saveData => {
            if(this.plyaing !== null){
                this.plyaing.Destroy();
                this.plyaing = null;    
            }
    
            this.StartTitle(saveData);    
        });

        this.plyaing.Start();
    }

    StartEnding(saveData: SaveData){
        const ending = this.endingFactory.Create(saveData);

        ending.OnExit.on(() => {
            ending.Destroy();
            
            this.StartTitle(saveData);
        });

        ending.Start();
    }

}