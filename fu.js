function calfu(combination, attrs, winFlatHand) {
    if (!combination.length) {
        return 25
    }
    /* 平和 */
    if (winFlatHand) {
        return attrs.discarder ? 30 : 20
    }
    let curFu = 20
    if (!attrs.discarder) {
        curFu += 2
    }
    if (!combination.filter(d => d.visable).length && attrs.discarder) {
        curFu += 10
    }
    let isSettled = false
    const threeDragonTiles = [35, 36, 37]
    const { roundWind, playerWind } = attrs
    // 雀头加符数
    if (threeDragonTiles.includes(combination[0].first)) {
        curFu += 2
    }
    if (roundWind == combination[0].first) {
        curFu += 2
    }
    if (playerWind == combination[0].first) {
        curFu += 2
    }
    if (combination[0].first == attrs.winTile) {
        curFu += 2
        isSettled = true
    }
    if (combination.filter(d => d.type === 1).filter(d => d.first === attrs.winTile - 1 || 
        (d.first % 10 === 1 && attrs.winTile % 10 === 3) || 
        (d.first % 10 === 7 && attrs.winTile % 10 === 7)).length) {
        curFu += 2
        isSettled = true
    }
    if (combination.filter(d => d.type === 1).filter(d => 
        d.first % 10 === attrs.winTile % 10 || 
        d.first % 10 === attrs.winTile % 10 - 2).length) {
        isSettled = true
    }
    for (let i = 1; i < 5; i++) {
        const cb = combination[i];
        if (cb.type === 2) {
            if (cb.visable || cb.first === attrs.winTile) {
                if (cb.first % 10 === 1 || cb.first % 10 ===9 || cb.first > 30) {
                    curFu += 4
                } else {
                    curFu += 2
                }
            } else {
                if (cb.first % 10 === 1 || cb.first % 10 ===9 || cb.first > 30) {
                    curFu += 8
                } else {
                    curFu += 4
                }
            }
        } else if (cb.type === 3) {
            if (cb.visable) {
                if (cb.first % 10 === 1 || cb.first % 10 ===9 || cb.first > 30) {
                    curFu += 16
                } else {
                    curFu += 8
                }
            } else {
                if (cb.first % 10 === 1 || cb.first % 10 ===9 || cb.first > 30) {
                    curFu += 32
                } else {
                    curFu += 16
                }
            }
        }
    }
    curFu = 10 * Math.ceil(curFu / 10)
    return Math.max(curFu, 30)
    // mingke
    // anke
    // minggang
    // angang // yiaojiu
}

/*
function quetou() {
    const threeDragonTiles = [35, 36, 37]
    const { roundWind, playerWind } = attrs
    // 雀头加符数
    if (threeDragonTiles.includes(combination[0].first)) {
        curFu += 2
    }
    if (roundWind == combination[0].first) {
        curFu += 2
    }
    if (playerWind == combination[0].first) {
        curFu += 2
    }

}
*/