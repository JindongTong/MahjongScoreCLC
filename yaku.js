let yakuRes = {
    'tanyo': isTanyao(),
    'pinhu': isPinhu()
}


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

function isFlatHand(combination, paras) {
    if ([35, 36, 37, paras.roundWind, paras.playerWind].includes(combination[0].first)) {
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
    return Number(a.concat(b).includes(paras.winTile))
}