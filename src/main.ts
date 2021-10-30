import "phaser";
import { StageDirector } from "./Model/StageDirector";
import { TitleFactory } from "./View/SceneFactory/TitleFactory";
import { SaveData } from "./Model/Element/SaveData";
import { PlaySceneImageKeys } from "./View/PlayScene";
import { StageFactory } from "./View/SceneFactory/StageFactory";
import { TitleSceneImageKeys } from "./View/TitleScene";
import { EndingFactory } from "./View/SceneFactory/EndingFactory";
import { EndingSceneImageKeys } from "./View/EndingScene";
import { PcFactory } from "./View/SceneFactory/PcFactory";
import { IPhaserConfigFactory } from "./View/interfaces";
import { SpFactory } from "./View/SceneFactory/SpFactory";

declare const TITLE_IMAGES : { [key in TitleSceneImageKeys]: string };
declare const SCENE_IMAGES : { [key in PlaySceneImageKeys]: string };
declare const HELP_IMAGES : string[];
declare const ENDING_IMAGES : { [key in EndingSceneImageKeys]: string };
declare const MEMBER_TEMPLATE : { [key: string]: (number[][])[] };
declare const STAGE_MEMBERS : (string | number[])[][][];
declare const AUDIENCE_SCORE_TEMPLATE : {[key:string]: (number | number[][])[]};
declare const AUDIENCE_ROUTE_TEMPLATE : {[key:string]: (number | number[][])[]};
declare const STAGE_AUDIENCES : (string | number)[][][];
declare const STAGES : (string | number)[][];

declare const __START_STAGE_INDEX : number;
declare const __INITIAL_SUBSCRIBER: number;

declare const __DEVICE: string;

const phaserConfigFactory = (():IPhaserConfigFactory => {
    if(__DEVICE == "pc") return new PcFactory();
    if(__DEVICE == "sp") return new SpFactory();
    throw new Error("not support:"+__DEVICE);
})();

const stageFactories = StageFactory.CreateArray(
    SCENE_IMAGES,
    HELP_IMAGES,
    STAGES,
    MEMBER_TEMPLATE, STAGE_MEMBERS,
    AUDIENCE_SCORE_TEMPLATE, AUDIENCE_ROUTE_TEMPLATE, STAGE_AUDIENCES,
    phaserConfigFactory
);

const director = new StageDirector(
    new TitleFactory(TITLE_IMAGES, HELP_IMAGES, phaserConfigFactory),
    stageFactories,
    new EndingFactory(ENDING_IMAGES, phaserConfigFactory)
);
const saveData = new SaveData();
saveData.subscribers = __INITIAL_SUBSCRIBER;
if(__START_STAGE_INDEX < 0){
    director.StartTitle(saveData);
}else{
    director.StartStage(__START_STAGE_INDEX, saveData);
}
