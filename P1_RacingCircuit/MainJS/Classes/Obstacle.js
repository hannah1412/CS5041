class Obstacle{
    
    constructor(x, y, type, playerZone){
        this.x = x
        this.y = y
        this.type = type                // 
        this.playerZone = playerZone

        // prototype size
        this.width = 40
        this.height = 40
        this.speed = 5
        this.active = true 
    }
    update(){
        this.y += this.speed

        // if offscreen -> deactivate 
        if(this.y > height + 50){
            this.active = false
        }
    }

    render(){
        push()

        switch(this.type){
            case 'rock':
                fill(100,100, 100)
                ellipse(this.x, this.y, this.width, this.height)
                break;
            case 'barrier':
                fill(200, 50, 50)
                rect(this.x - this.width/2, this.y - this.height/2, this.width, this.height)
                break;
        }
        pop()
    }

    // for COllision manager 
    collidesWith(player){
        let d = dist(this.x, this.y, player.x, player.y)
        return d < (this.width/2 + player.width/2)
    }
}