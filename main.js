/*未拆分num_ls 已拆分obj */
// obj 
/* 
 * [{ type: duizi/shun/ke/gang, first: 13, visible: true},{}]
*/
var allPossibleSplit = []
var allTiles = [] // [1, 1, 2, 2, 3, 3, 12, 12, 12] 
var maxScore = 0
var finalYakus = {}

let gameAttr = {
    winTile: 0,
    dealer: false,
    honba: 0,
    playerWind: 0, // 30x
    roundWind: 0,
    riichiPlayers: [],
    wRiichi: false,
    discarder: 0,
    riichiNum: 0, // 全局变量
    doras: [],
    innerDoras: [],
    redDoraNum: 0,
    northDoraNum: 0,
}

function init() {
    winTile = 0
    // TODO allTile
    // 红宝牌数值转换
    maxScore = 0
    finalYakus = {}
}

function convertComb(rawObj) {
    return rawObj
}

// entry
// obj: hand, combination, hudeshui, henazhang, dora, innerDora,
// paijuzhuangkuang (e.g liji, dora, ...)
function calScore(rawObj) {
    let obj = convertComb(rawObj)
    obj.hand.sort()
    init()
    if (obj.combination.length === 0) {
        const sevenRes = splitAsSevenDouble(obj.hand)
        if (sevenRes) {
            allPossibleSplit.push([])
        }
    }
    splitTileList(obj.hand, obj.combination)
    console.log(allPossibleSplit)
    if (allPossibleSplit.length == 0) {
        return 0;  // 不和
    }

    const visable = allPossibleSplit.filter(d => d.visable).length > 0

    allPossibleSplit.forEach(comb => {
        // 判断和拆分有关的役种
        // isduanyao()
        // isYiQi(com) // 789 99
        // isSanSeKe(com)
        //[[1,2,3],[2,3,4]]
        let yakuRes = {
            'tanyo': isTanyao(obj.hand),//断幺
            'flatHand': isFlatHand(comb, obj.gameAttr),//平和
            'mixedFlush': isMixedFlush(obj.hand, visable),//狭义混一色 不能是字一色或者清一色
            'pureFlush': isPureFlush(obj.hand, visable),//清一色
            'sevenPairs': comb.length === 0 ? 2 : 0, //isSevenPairs(comb),//七对子
            'doubleSequence': isDoubleSequence(comb),//狭义一杯口 不能是七对子或二杯口
            'wDoubleSequence': isWDoubleSequence(comb),//二杯口
            // 'tripleTriplets': isTripleTriplets(comb),//三色同刻
            // 'tripleSeqence': isTripleSeqence(comb),//三色同顺
            // 'allTriplets': isAllTriplets(comb),// 对对和
            // 'threeConcealedTriplets': isThreeConcealedTriplets(comb),//三暗刻
            // 'threeQuads': isThreeQuads(comb),//三杠子
            // 'littleThreeDragons': isLittleThreeDragons(comb),//小三元
            // 'pureTerminalHand': isPureTerminalHand(comb),//狭义混老头 不能是清老头 更不能是字一色
            // 'terminalOrHonorInEveryGroup': isTerminalOrHonorInEveryGroup(comb),//狭义混全 不能是纯全 肯定更不能是字一色
            // 'straight': isStraight(comb),//一气通贯
            // 'terminalInEveryGroup': isTerminalInEveryGroup(comb),//纯全
            // //以下是传进来的参数
            // 'riichi': 0,
            // 'wRiichi': 0,
            // 'menzenchinWinningDraw': 0,
            // 'playerWind': 0,
            // 'roundWind': 0,
            // 'dragonTiles': 0,
            // 'chankan': 0,
            // 'deadWallDraw': 0,
            // 'lastPick': 0,
            // 'lastDiscard': 0,
            // 'ippatsu': 0,
        }
        let doraRes = {
            'dora': 0, // 宝牌
            'redDora': 0, //红宝牌
            'northDora': 0, //拔北宝牌
            'innerDora': 0, //里宝牌
        }
        // let doraRes = {
        //     'dora': isDora(), // 宝牌
        //     'redDora': isRedDora(), //红宝牌
        //     'northDora': isNorthDora(), //拔北宝牌
        //     'innerDora': isInnerDora(), //里宝牌
        // }
        console.log(yakuRes)
        let han = 0, hanList = {}
        for (let it in yakuRes) {
            han += yakuRes[it]
            if (yakuRes[it]) {
                hanList[it] = yakuRes[it]
            }
        }
        if (!han) {
            return
        }
        for (let it in doraRes) {
            han += doraRes[it]
            if (doraRes[it]) {
                hanList[it] = doraRes[it]
            }
        }
        const fu = calFu(comb, gameAttr, yakuRes['flatHand'])
        console.log(fu)
        const score = getScore(han, fu, gameAttr.dealer, !gameAttr.discarder)
        console.log(score)
        if (score > maxScore) {
            maxScore = score
            finalYakus = hanList
        }
        // 判断和牌数值有关的役种
        // 断幺九、混老头、清/混一色、表里红北宝牌
        // use allTiles as para
    })
    console.log(finalYakus)
    console.log(maxScore)
    // 算符数：
    // 1. 先看平和，如果没有，优先单骑、坎张和边张
    // 2. 七对子25符固定，门清自摸平和固定20符，门清荣和加10符，其他不满30符加到30
}


function getScore(han, fu, dealer, isTsumo) {
    return 4 * Math.pow(2, han + 2) * fu
}


function splitTileList(hand, combination) {
    if (hand.length === 0) {
        allPossibleSplit.push(combination)
        return true
    }
    //判断combination里是否有将
    if (combination.filter(d => !d.type).length === 0) {
        let double = []
        for (let i = 0; i < hand.length - 1; i++) {
            if ((i == 0 || hand[i - 1] != hand[i]) && hand[i] == hand[i + 1]) {
                double.push(hand[i])
            }
        }
        if (double.length === 0) {
            return false
        }
        let temRes = false
        for (let it of double) {
            let anoHand = [...hand]
            anoHand.splice(hand.findIndex(d => d === it), 2)
            temRes = splitTileList(anoHand, combination.concat([{ type: 0, first: it, visible: false }])) || temRes
        }
        return temRes
    }
    // 拆刻子
    let resCurStep = false
    if (hand[0] === hand[1] && hand[0] === hand[2]) {
        let anoHand = [...hand]
        anoHand.splice(0, 3)
        resCurStep = splitTileList(anoHand, combination.concat([{ type: 2, first: hand[0], visiable: false }]))
    }
    // 拆顺子
    if (hand[0] > 30) {
        return resCurStep
    }
    const second = hand.findIndex(d => d === hand[0] + 1)
    const third = hand.findIndex(d => d === hand[0] + 2)
    if (second > 0 && third > 0) {
        let anoHand = [...hand]
        anoHand.splice(third, 1)
        anoHand.splice(second, 1)
        anoHand.splice(0, 1)
        resCurStep = splitTileList(anoHand, combination.concat([{ type: 1, first: hand[0], visable: false }])) || resCurStep
    }
    return resCurStep
}

function splitAsSevenDouble(hand) {
    for (let i = 0; i < 7; i++) {
        if ((i && hand[2 * i - 1] === hand[2 * i]) || hand[2 * i] !== hand[2 * i + 1]) {
            return false
        }
    }
    return true
}