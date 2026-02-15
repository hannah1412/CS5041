class UI{
    render(players, gameState){
        // player 1 sstat
        fill(255)
        textSize(14)
        text(`P1 score: ${players[0].score}`, 10,30)
        text(`P1 health: ${players[0].heart}`, 10, 55)
        text(`P1 boosters: ${players[0].boosts}`, 10, 80)

        // player'2 stat
        text(`P2 score: ${players[1].score}`, width/2 +10,30)
        text(`P2 health: ${players[1].heart}`, width/2 + 10, 55)
        text(`P2 boosters: ${players[1].boosts}`, width/2 + 10, 80)

        // game states displayu
        if(gameState === 'MENU'){
            this.renderMenu()
        } else if(gameState === 'GAME_OVER'){
            this.renderEndGame(players)
        }
    }


    // TODO: menu renderer
    renderMenu(){
        textAlign(CENTER)
        textSize(40)
        text(`RACING GAME`, width/2, height/2 -50)
        textSize(20)
        text(`Press SPACE to start`, width/2, height/2 +20)
        textAlign(LEFT)
    }
    // TODO: END game rendererr (win/ game over)

    renderEndGame(players){
        textAlign(CENTER)
        textSize(40)
        
        let winner = players[0].score > players[1].score ? 'Player 1' : 'Player 2'
        text(`${winner} Wins!`, width/2, height/2)
        textAlign(LEFT)
    }
    // TODO: pause game rendererr
}