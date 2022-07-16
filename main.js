/*未拆分num_ls 已拆分obj */
// obj 
/* 
 * [{ type: duizi/shun/ke/gang, first: 13, visible: true},{}]
*/
var allPossibleSplit = []
var allTiles = [] // [1, 1, 2, 2, 3, 3, 12, 12, 12]

function init() {
    win = false;
    // TODO allTiles
    // 红宝牌数值转换
}

// entry
// obj: hand, combination, hudeshui, henazhang, dora, innerDora,
// paijuzhuangkuang (e.g liji, dora, ...)
function calScore(obj) {
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
    allPossibleSplit.forEach(com => {
        if (com.length != 0) {
            // 判断和拆分有关的役种
            // 
            // isYiQi(com) // 789 99
            // isSanSeKe(com)
            //[[1,2,3],[2,3,4]]

        }
        // 判断和牌数值有关的役种
        // 断幺九、混老头、清/混一色、表里红北宝牌
        // use allTiles as para
    })
    // 算符数：
    // 1. 先看平和，如果没有，优先单骑、坎张和边张
    // 2. 七对子25符固定，门清自摸平和固定20符，门清荣和加10符，其他不满30符加到30
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
            return splitTileList(hand.slice(hand.findIndex(d => d === it), 2), combination + [{type: 0, first: it, visible: false}])
        }
    }
    const curRes = (
        hand[0] === hand[1] && hand [0] === hand[2]
    ) ? splitTileList(hand.slice(0, 3),combination + [{type: 2, first: hand[0], visiable: false}])
    : false
    // 拆顺子
    const second = hand.findIndex(d => d === hand[0] + 1)
    const third = hand.findIndex(d => d === hand[0] + 2)
    if (second > 0  && third > 0) {
        return splitTileList(hand.slice(0,1).slice(second - 1, 1).slice(third -2, 1), combination +[{type: 1, first: hand[0], visable: false}]) || curRes
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