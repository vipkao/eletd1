const UTIL = {};
UTIL.BuildWaitStep = function(images, score, route, waitStart, waitStep, count){
    const ret = [...Array(count)].map((_, i) => {
        if(Array.isArray(images)){
            const index = Math.floor(Math.random()*images.length);
            const image = images[index];
            return [image, score, route, waitStart + waitStep * i];
        }else{
            return [images, score, route, waitStart + waitStep * i];
        }
    });
    return ret;
};
UTIL.MargeByWait = function(audiences){
    const ret = audiences.sort((a, b) => {
        if(a[3] < b[3]) return -1;
        if(a[3] > b[3]) return 1;
        return 0;
    });
    return ret;
}

const SCENE_IMAGES = {
    "titleImage": "images/stage_title1.png",
    "captionImage": "images/stage_caption1.png",
    "stageImage": "images/stage1.jpg",
    "startButtonImage": "images/stage_start1.png",
    "liveInfoImage": "images/live_info1.png",
    "speed0": "images/speed0.png",
    "speed1": "images/speed1.png",
    "speed2": "images/speed2.png",
    "speed3": "images/speed3.png",
    "liveOK": "images/live_ok1.png",
    "liveNG": "images/live_ng1.png",
    "goNext": "images/go_next1.png",
    "goRetry": "images/go_retry1.png",
    "goTitle": "images/go_title1.png",
    "ok": "images/ok1.png",
    "cancel": "images/cancel1.png",
    "goLeft": "images/go_left1.png",
    "goRight": "images/go_right1.png",
    "close": "images/close1.png",
    "successHeader": "images/success1.png",
    "failHeader": "images/fail1.png",
    "liveWhereHeader": "images/live_where1.png",
    "selectMemberHeader": "images/select_member1.png",
    "signGood": "images/sign_good1.png",
    "infoListen": "images/info_listen1.png",
};

const SCENE_ATLAS_IMAGES = {
    "50number" : "images/50number1.png"
};

const TITLE_IMAGES = {
    "background": "images/title1.jpg",
    "newButton": "images/title_new1.png",
    "continueButton": "images/title_continue1.png",
    "goLeft": "images/go_left1.png",
    "goRight": "images/go_right1.png",
    "close": "images/close1.png",
};

const HELP_IMAGES = [
    "images/help1.jpg",
    "images/help2.jpg",
    "images/help3.jpg",
    "images/help4.jpg"
];

const ENDING_IMAGES = {
    "ending1": "images/ending1.jpg",
    "ending2": "images/ending2.jpg",
};

const TASTE_20 = [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];
const AUDIENCE_IMAGES = ["a01","a02","a03","a04","a05","a06","a07","a08","a09","a10"];

//非公式wikiヘッダー順
const MEMBER_TEMPLATE = {
    "ui":[
        [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]
    ],
    "thima":[
        [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]
    ],
    "mei":[
        [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]
    ],
    "amo":[
        [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]
    ],
    "koha":[
        [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]
    ],
    "chire":[
        [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]
    ],
};

//非公式wikiヘッダー順
const STAGE_MEMBERS = [
    //1
    [
        ["ui", "c", [100], TASTE_20], 
        ["thima", "c", [100], TASTE_20], 
        ["mei", "c", [100], TASTE_20], 
        ["amo", "c", [100], TASTE_20], 
        ["koha", "c", [100], TASTE_20], 
        ["chire", "c", [100], TASTE_20], 
    ],
    //2
    [
        ["ui", "c", [100], TASTE_20], 
        ["thima", "c", [100], TASTE_20], 
        ["mei", "c", [100], TASTE_20], 
        ["amo", "c", [100], TASTE_20], 
        ["koha", "c", [100], TASTE_20], 
        ["chire", "c", [100], TASTE_20], 
    ],
    //3
    //初配信順
    [
        ["ui", "c", [100],    [[ 0, 0],[ 0, 0],[ 0, 0],[20, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]], 
        ["thima", "c", [100], [[20, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]], 
        ["mei", "c", [100],   [[ 0, 0],[ 0, 0],[20, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]], 
        ["amo", "c", [100],   [[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[20, 0],[0, 0],[0, 0]]], 
        ["koha", "c", [100],  [[ 0, 0],[20, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]], 
        ["chire", "c", [100], [[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[20, 0],[ 0, 0],[0, 0],[0, 0]]], 
    ],
    //4
    [
        ["ui", "c", [100],    [[10, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["thima", "c", [100], [[0, 50],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["mei", "c", [100],   [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["amo", "c", [100],   [[0, 50],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["koha", "c", [100],  [[0, 50],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["chire", "c", [100], [[10, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
    ],
    //5
    [
        ["ui", "c", [100], TASTE_20], 
        ["thima", "c", [100], TASTE_20], 
        ["mei", "c", [100], TASTE_20], 
        ["amo", "c", [100], TASTE_20], 
        ["koha", "c", [100], TASTE_20], 
        ["chire", "c", [100], TASTE_20], 
    ],
    //6
    [
        ["ui", "c", [100],    [[20, 0],[ 5, 0],[ 5, 0],[ 5, 0],[ 5, 0],[ 5, 0],[0, 0],[0, 0]]], 
        ["thima", "c", [100], [[ 5, 0],[20, 0],[ 5, 0],[ 5, 0],[ 5, 0],[ 5, 0],[0, 0],[0, 0]]], 
        ["mei", "c", [100],   [[ 5, 0],[ 5, 0],[20, 0],[ 5, 0],[ 5, 0],[ 5, 0],[0, 0],[0, 0]]], 
        ["amo", "c", [100],   [[ 5, 0],[ 5, 0],[ 5, 0],[20, 0],[ 5, 0],[ 5, 0],[0, 0],[0, 0]]], 
        ["koha", "c", [100],  [[ 5, 0],[ 5, 0],[ 5, 0],[ 5, 0],[20, 0],[ 5, 0],[0, 0],[0, 0]]], 
        ["chire", "c", [100], [[ 5, 0],[ 5, 0],[ 5, 0],[ 5, 0],[ 5, 0],[20, 0],[0, 0],[0, 0]]], 
    ],
    //7
    [
        ["ui", "c", [100],    [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["thima", "c", [100], [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["mei", "c", [100],   [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["amo", "c", [100],   [[0, 0],[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["koha", "c", [100],  [[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["chire", "c", [100], [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
    ],
    //8
    [
        ["ui", "c", [100], TASTE_20], 
        ["thima", "c", [100], TASTE_20], 
        ["mei", "c", [100], TASTE_20], 
        ["amo", "c", [400], [[0, 0],[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]], 
        ["koha", "c", [100], TASTE_20], 
        ["chire", "c", [100], TASTE_20], 
    ],
];

//判定間隔,満足度上限,登録者数増加量,登録者数減少量,性向
const AUDIENCE_SCORE_TEMPLATE = {
    "s01": [3, 300, 5, 0, TASTE_20],

    //ぺろ部廃部のサムネ
    "s0201": [3,  450, 10, 0, [[ 0, 0],[ 0, 0],[ 0, 0],[60, 0],[ 0, 0],[60, 0],[0, 0],[0, 0]]],
    "s0202": [3,  450, 10, 0, [[60, 0],[ 0, 0],[ 0, 0],[ 0, 0],[60, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0203": [3,  450, 10, 0, [[ 0, 0],[60, 0],[60, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0204": [3,  800, 10, 0, [[ 0, 0],[60, 0],[ 0, 0],[60, 0],[60, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0205": [3,  800, 10, 0, [[60, 0],[ 0, 0],[60, 0],[ 0, 0],[ 0, 0],[60, 0],[0, 0],[0, 0]]],

    "s0301": [3, 150, 0, 0, [[ 0, 0],[20, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]],
    "s0302": [3, 100, 20, 0, [[20, 0],[ 0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]],

    "s04": [3, 100, 10, 0, TASTE_20],
    
    "s05": [3, 400, 20, 0, [[100, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]],

    "s0601": [3, 150, 10, 0, [[20, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0602": [3, 150, 10, 0, [[ 0, 0],[20, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0603": [3, 150, 10, 0, [[ 0, 0],[ 0, 0],[20, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0604": [3, 150, 10, 0, [[ 0, 0],[ 0, 0],[ 0, 0],[20, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0605": [3, 150, 10, 0, [[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[20, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0606": [3, 150, 10, 0, [[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[20, 0],[0, 0],[0, 0]]],

    "s0701": [3, 100, 10, 0, [[20, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0702": [3, 400, 10, 0, [[40, 0],[20, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],

    "s0801": [3, 800, 20, 0, [[120, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0802": [3, 300, 10, 0, [[ 60, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],
    "s0803": [3, 300, 0, 10, [[ 60, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],

    "swcc1": [10, 100, 0, 0, [[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[ 0, 0],[0, 0],[0, 0]]],

};

//離脱移動総量,[x, y, 開始step,移動量],…]
const AUDIENCE_ROUTE_TEMPLATE = {
    "r0101": [ 160, [[150, 0, 0, 5],[150, 800, 0, 0]] ],
    "r0102": [ 160, [[400, 800, 0, 5],[400, 0, 0, 0]] ],
    "r0103": [ 160, [[650, 0, 0, 5],[650, 800, 0, 0]] ],

    "r0201": [ 160, [[0, 250, 0, 5],[800, 250, 0, 0]] ],
    "r0202": [ 160, [[800, 550, 0, 5],[0, 550, 0, 0]] ],

    "r0301": [ 170, [[250, 0, 0, 5],[150, 800, 0, 0]] ],
    "r0302": [ 170, [[450, 800, 0, 5],[550, 0, 0, 0]] ],

    "r0401": [ 170, [[0, 400, 0, 5],[800, 400, 0, 0]] ],
    "r0402": [ 180, [[200, 0, 0, 5],[600, 800, 0, 0]] ],
    "r0403": [ 180, [[600, 0, 0, 5],[200, 800, 0, 0]] ],

    "r05": [ 460, [[150, 0, 0, 5],[150, 650, 130, 5],[400, 650, 180, 5],[400, 150, 280, 5],[650, 150, 330, 5],[650, 800, 0, 0]] ],

    "r0601": [ 160, [[250, 0, 0, 5],[250, 800, 0, 0]] ],
    "r0602": [ 95, [[800, 350, 0, 5],[600, 350, 40, 5],[600, 400, 50, 5],[800, 400, 0, 0]] ],

    "r0701": [ 160, [[150, 0, 0, 5],[150, 800, 0, 0]] ],
    "r0702": [ 160, [[200, 800, 0, 5],[200, 0, 0, 0]] ],
    "r0703": [ 160, [[250, 0, 0, 5],[250, 800, 0, 0]] ],
    "r0704": [ 160, [[650, 0, 0, 5],[650, 800, 0, 0]] ],
}

//アイコン,スコア,ルート,wait
const STAGE_AUDIENCES = [
    //1初配信
    UTIL.MargeByWait(
                UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0101",  0, 30, 30)
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0101", 10, 30, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0101", 20, 30, 30))    
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0102",  0, 30, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0102", 10, 30, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0102", 20, 30, 30))    
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0103",  0, 30, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0103", 10, 30, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s01", "r0103", 20, 30, 30))
    )
    ,
    //2２回行動
                UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s04", "r0301", 0, 20, 20)
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s04", "r0302", 500, 20, 20))
    ,
    //3リレー
                UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0601", "r05",    0, 20, 20)
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0602", "r05",  400, 20, 20))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0603", "r05",  800, 20, 20))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0604", "r05", 1200, 20, 20))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0605", "r05", 1600, 20, 20))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0606", "r05", 2000, 20, 20))
    ,   
    //4天使のティータイム
                UTIL.BuildWaitStep("wcc1", "swcc1", "r0401", 200, 10, 5)
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s05", "r0401", 0, 20, 20))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s05", "r0402", 0, 20, 20))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s05", "r0403", 0, 20, 20))
    ,
    //5ヤバい人
                UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0801", "r0701", 0, 20, 30)
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0802", "r0702", 0, 20, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0801", "r0703", 0, 20, 30))
        .concat(UTIL.BuildWaitStep("d01", "s0803", "r0704", 0, 60, 10))
    ,
    //6適材適所
                UTIL.BuildWaitStep("wcc1", "swcc1", "r0101", 400, 10, 5)
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0201", "r0101", 0, 20, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0202", "r0102", 0, 20, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0203", "r0103", 0, 20, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0204", "r0201", 0, 20, 30))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES, "s0205", "r0202", 0, 20, 30))
    ,
    //7ＡＰＥＸ
                UTIL.BuildWaitStep(["a01","a02","a03","a07"], "s0701", "r0601",  0, 20, 60)
        .concat(UTIL.BuildWaitStep(["a01","a02","a03","a07"], "s0702", "r0602",  0, 20, 60))
    ,
    //8うぇぶかむ
                UTIL.BuildWaitStep("wcc1", "s0301", "r0101", 0, 4, 100)
        .concat(UTIL.BuildWaitStep("wcc1", "s0301", "r0102", 0, 4, 100))
        .concat(UTIL.BuildWaitStep("wcc1", "s0301", "r0103", 0, 4, 100))
        .concat(UTIL.BuildWaitStep(AUDIENCE_IMAGES,   "s0302", "r0103", 100, 30, 10))
    ,
];

//タイトル,目標人数,枠数,配信回数,背景,キャプション
const STAGES = [
    ["初配信！全員お披露目だ！", 1000, 6, 12, "stage0", "※リスナーは点線上を移動します。\n※画面右の〇を押して配信を開始！\n※配信範囲でリスナーのルートをカバーし、\n　画面右上の目標まで登録者を増やしましょう！"],
    ["個人配信枠のテストをしよう", 300, 1, 2, "stage4", "※画面右の配信枠を再度クリックすると\n　メンバーの入れ替えが出来ます。\n※同じメンバーを選ぶと、場所の移動になります。\n※回数が決まっているので気を付けてください。"],
    ["個人リレー配信！", 1000, 1, 20, "stage1", "全員でリレー配信しよう！\n順番どうする…？\nメモ＆リトライ必須！"],
    ["天使のティータイムは清楚", 1000, 3, 3, "stage5", "※重なっている配信範囲は、コラボになります。\nコラボするとリスナーはより満足してくれるかも？"],
    ["ヤバい人に目を付けられた…", 300, 6, 12, "stage3", "（どうしよ…どうする…？）\n※ヤバい人は画面外に出ると、\n　謎の力で登録者数が減ります。\n"],
    ["ぺ〇ぺろ部が無くなる…？", 500, 6, 24, "stage4", "どんな配置で対応すると、いい感じかな？\nメモ＆リトライ必須！"],
    ["Ａ〇ＥＸの大会に出場！", 1000, 3, 9, "stage2", "挟み撃ちだ！\n二手に分かれよう！"],
    ["ウェブカムチャ〇ト暴走？！", 100, 2, 4, "stage6", "チャット欄を覆いつくすウェブカム！\nリスナーが見えない！"],
];

//-1でタイトルからスタート
const __START_STAGE_INDEX = -1;
const __INITIAL_SUBSCRIBER = 0;
