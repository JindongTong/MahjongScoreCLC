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

}

function testA() {
    console.log('test A')
    testB()
}

// entry
// obj: hand, combination, hudeshui, henazhang, dora, innerDora,
// paijuzhuangkuang (e.g liji, dora, ...)
function calScore(rawObj) {
    let obj = convertComb(rawObj)
    hand.sort()
    init()
    if (obj.combination.length === 0) {
        const sevenRes = splitAsSevenDouble(obj.hand)
        if (sevenRes) {
            allPossibleSplit.push([])
        }
    }
    splitTileList(obj.hand, obj.combination)
    if (allPossibleSplit.length == 0) {
        return 0;  // 不和
    }
    
    allPossibleSplit.forEach(comb => {
        if (comb.length != 0) {
            // 判断和拆分有关的役种
            // isduanyao()
            // isYiQi(com) // 789 99
            // isSanSeKe(com)
            //[[1,2,3],[2,3,4]]
            let yakuRes = {
                'tanyo': isTanyao(),//断幺
                'flatHand': isFlatHand(),//平和
                'mixedFlush': isMixedFlush(),//狭义混一色 不能是字一色或者清一色
                'pureFlush': isPureFlush(),//清一色
                'sevenPairs': isSevenPairs(),//七对子
                'doubleSequence': isDoubleSequence(),//狭义一杯口 不能是七对子或二杯口
                'wDoubleSequence': isWDoubleSequence(),//二杯口
                'tripleTriplets': isTripleTriplets(),//三色同刻
                'tripleSeqence': isTripleSeqence(),//三色同顺
                'allTriplets': isAllTriplets(),// 对对和
                'threeConcealedTriplets': isThreeConcealedTriplets(),//三暗刻
                'threeQuads': isThreeQuads(),//三杠子
                'littleThreeDragons': isLittleThreeDragons(),//小三元
                'pureTerminalHand': isPureTerminalHand(),//狭义混老头 不能是清老头 更不能是字一色
                'terminalOrHonorInEveryGroup': isTerminalOrHonorInEveryGroup(),//狭义混全 不能是纯全 肯定更不能是字一色
                'straight': isStraight(),//一气通贯
                'terminalInEveryGroup': isTerminalInEveryGroup(),//纯全
                //以下是传进来的参数
                'riichi': 0,
                'wRiichi': 0,
                'menzenchinWinningDraw': 0,
                'playerWind': 0,
                'roundWind': 0,
                'dragonTiles': 0,
                'chankan': 0,
                'deadWallDraw': 0,
                'lastPick': 0,
                'lastDiscard': 0,
                'ippatsu': 0,

            }
            let doraRes = {
                'dora': isDora(), // 宝牌
                'redDora': isRedDora(), //红宝牌
                'northDora': isNorthDora(), //拔北宝牌
                'innerDora': isInnerDora(), //里宝牌
            }
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
            const score =  getScore(han, fu, gameAttr.dealer, !gameAttr.discarder)
            if (score > maxScore) {
                maxScore = score
                finalYakus = hanList
            }
        }
        // 判断和牌数值有关的役种
        // 断幺九、混老头、清/混一色、表里红北宝牌
        // use allTiles as para
    })
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
        if (double.length === 0){
            return false
        }
        for (let it in double) {
            return splitTileList(hand.slice(hand.findIndex(d => d === it), 2), combination.concat([{type: 0, first: it, visible: false}]))
        }
    }
    // chai kezi
    const curRes = (
        hand[0] === hand[1] && hand [0] === hand[2]
    ) ? splitTileList(hand.slice(0, 3),combination.concat([{type: 2, first: hand[0], visiable: false}]))
    : false
    // 拆顺子
    if (hand[0] > 30) {
        return false
    }
    const second = hand.findIndex(d => d === hand[0] + 1)
    const third = hand.findIndex(d => d === hand[0] + 2)
    if (second > 0  && third > 0) {
        return splitTileList(hand.slice(0,1).slice(second - 1, 1).slice(third -2, 1), combination.concat([{type: 1, first: hand[0], visable: false}])) || curRes
    }
    return false
}

function splitAsSevenDouble(hand) {
    for (let i = 0; i < 7; i++) {
        if ((i && hand[2*i-1] === hand [2*i]) || hand[2*i] !== hand[2*i+1]) {
            return false
        }
        return true
    }
}