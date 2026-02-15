class CollisionManager{
    
    // safeguard  for collision 
    checkCollision(players, obstacles){
        // apply to each player's zone
        for (let player of players){
            for(let obs of obstacles){
                if(obs.playerZone === player.id && (obs.collidesWith(player))){
                    this.handleCollision(player, obs)
                }
            }
        }
    }
    handleCollision(player, obstacle){
        player.takeDamage()
        obstacle.active = false
    }
}