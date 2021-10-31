import { SaveData } from "Model/Element/SaveData";
import { IPlayStage, IPlayStageFactory } from "Model/interfaces";
import { PlaySceneFacade } from "Model/PlaySceneFacade";
import { PhaserGame } from "../PhaserGame";
import { PlayScene, PlaySceneAtlasImageKeys, PlaySceneImageKeys } from "../PlayScene";

export class StageFactory implements IPlayStageFactory{

    private readonly playSceneImages: { [key in PlaySceneImageKeys]: string };
    private readonly playSceneAtlasImages: { [key in PlaySceneAtlasImageKeys]: string };
    private readonly helpImages: string[];
    private readonly stage: (string | number)[];
    private readonly memberTemplate: { [key: string]: (number[][])[] };
    private readonly stageMembers: (string | number[] | number[][])[][];
    private readonly audienceScoreTemplate: {[key:string]: (number | number[][])[]};
    private readonly audienceRouteTemplate: {[key:string]: (number | number[][])[]};
    private readonly stageAudiences: (string | number)[][];
    private readonly phaserGame: PhaserGame;

    constructor(
        playSceneImages: { [key in PlaySceneImageKeys]: string },
        playSceneAtlasImages: { [key in PlaySceneAtlasImageKeys]: string },
        helpImages: string[],
        stage: (string | number)[],
        memberTemplate: { [key: string]: (number[][])[] },
        stageMembers: (string | number[] | number[][])[][],
        audienceScoreTemplate: {[key:string]: (number | number[][])[]},
        audienceRouteTemplate: {[key:string]: (number | number[][])[]},
        stageAudiences: (string | number)[][],
        phaserGame: PhaserGame
    ){
        this.playSceneImages = playSceneImages;
        this.playSceneAtlasImages = playSceneAtlasImages;
        this.helpImages = helpImages;
        this.stage = stage;
        this.memberTemplate = memberTemplate;
        this.stageMembers = stageMembers;
        this.audienceScoreTemplate = audienceScoreTemplate;
        this.audienceRouteTemplate = audienceRouteTemplate;
        this.stageAudiences = stageAudiences;
        this.phaserGame = phaserGame;
    }

    Create(saveData: SaveData): IPlayStage {
        const title = this.stage[0] as string;
        const targetSubscriberDelta = this.stage[1] as number;
        const maxLiveSpace = this.stage[2] as number;
        const memberChangeLimit = this.stage[3] as number;
        const stageImage = this.stage[4] as string;
        const caption = this.stage[5] as string;
        const ret = new PlayScene(
            title, caption, stageImage,
            this.playSceneImages,
            this.playSceneAtlasImages,
            this.helpImages,
            this.stageAudiences,
            PlayScene.CreateMemberConfigs(this.stageMembers),
            this.phaserGame,
            new PlaySceneFacade(
                maxLiveSpace,
                saveData.subscribers, saveData.subscribers + targetSubscriberDelta,
                500, 100, "normal",
                memberChangeLimit,
                PlaySceneFacade.CreateMemberTypeA(
                    this.memberTemplate,
                    this.stageMembers
                ),
                PlaySceneFacade.CreateAudiencePtpTypeA(
                    this.audienceScoreTemplate,
                    this.audienceRouteTemplate,
                    this.stageAudiences
                ), 
                saveData,
                PlaySceneFacade.CreateDefaultMillisecondServer(),
            )
        );
        return ret;
    }

    static CreateArray(
        playSceneImages: { [key in PlaySceneImageKeys]: string },
        playSceneAtlasImages: { [key in PlaySceneAtlasImageKeys]: string },
        helpImages: string[],
        stages: (string | number)[][],
        memberTemplate: { [key: string]: (number[][])[] },
        stageMember: (string | number[])[][][],
        audienceScoreTemplate: {[key:string]: (number | number[][])[]},
        audienceRouteTemplate: {[key:string]: (number | number[][])[]},
        stageAudiences: (string | number)[][][],
        phaserGame: PhaserGame
    ): StageFactory[]{
        const ret = [...Array(stages.length)].map((_, i) => {
            return new StageFactory(
                playSceneImages,
                playSceneAtlasImages,
                helpImages,
                stages[i],
                memberTemplate,
                stageMember[i],
                audienceScoreTemplate,
                audienceRouteTemplate,
                stageAudiences[i],
                phaserGame
            );
        });
        return ret;
    }

}