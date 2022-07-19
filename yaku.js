

function isTanyao(hand) {
    //1 9 11 19 21 29 31-37
    let yao = [1,9,11,19,21,29,31,32,33,34,35,36,37]
    for (let i = 0; i < yao.length; i++) {
        if (hand.includes(i) === true) {
            return 0
        }
    }
    return 1
}

function isFlatHand(combination, attrs) {
    if (!combination.length) {
        return 0
    }
    if ([35, 36, 37, attrs.roundWind, attrs.playerWind].includes(combination[0].first)) {
        return 0
    }
    if (combination.filter(d => d.visible).length) {
        return 0
    }
    if (combination.filter(d => d.type > 1).length) {
        return 0
    }
    let a = combination.filter(d => d.type && d.first % 10 < 7).map(d => d.first)
    let b = combination.filter(d => d.type && d.first % 10 > 1).map(d => d.first + 2)
    return Number(a.concat(b).includes(attrs.winTile))
}

function isMixedFlush(hand, visable) {
    const handNum = hand.length
    if (hand.filter(d => d > 30).length == 0 || hand.filter(d => d > 30).length == handNum) {
        return 0
    }
    const numTiles = hand.filter(d => d < 30)
    if (Math.max(...numTiles) < 10) {
        return 3 - Number(visable)
    }
    if (Math.min(...numTiles) > 10 && Math.max(...numTiles) < 20) {
        return 3 - Number(visable)
    }
    if (Math.min(...numTiles) > 20 && Math.max(...numTiles) < 30) {
        return 3 - Number(visable)
    }
    return 0
}

function isPureFlush(hand, visable) {
    if (Math.max(...hand) < 10) {
        return 3 - Number(visable)
    }
    if (Math.min(...hand) > 10 && Math.max(...hand) < 20) {
        return 3 - Number(visable)
    }
    if (Math.min(...hand) > 20 && Math.max(...hand) < 30) {
        return 3 - Number(visable)
    }
    return 0
}
//combination的内容是不是排序过？应该是
function isWDoubleSequence(combination) {
    if (!combination.length) {
        return 0
    }
    if (combination.filter(d => d.visable || d.type > 1).length) {
        return 0
    }
    if (combination[1].first === combination[2].first && combination[3].first === combination[4].first) {
        return 3
    }
    return 0
}

function isDoubleSequence(combination) {
    if (!combination.length) {
        return 0
    }
    if (combination.filter(d => d.visable).length) {
        return 0
    }
    if (combination[1].first === combination[2].first && combination[1].type === combination[2].type)
    for (let i = 1; i < 4; i++) {
        if (combination[i].type === 1 && combination[i + 1].type === 1 
            && combination[i].first === combination[i + 1].first) {
            if (i === 1) {
                if (combination[3].type === 1 && combination[4].type === 1 
                    && combination[3].first === combination[4].first) {
                    return 0
                }
            }
            return 1
        }
    }
    return 0
}