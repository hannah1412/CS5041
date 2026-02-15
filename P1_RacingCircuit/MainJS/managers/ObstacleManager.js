class ObstacleManager{
    
    constructor(){
        this.obstacles = []
        this.spawnTimer = 0
        this.spawnInterval = 60         //frames
    }

    update(){
        this.spawnTimer++

        if(this.spawnTimer >= this.spawnInterval){
            this.spawnObstacle()
            this.spawnTimer = 0
        }

        // update all obs
        for(let i=this.obstacles.length -1; i>=0; i--){
            this.obstacles[i].update()

            if(!this.obstacles[i].active){
                this.obstacles.splice(i, 1)
            }
        }
    }

    // -----------
    spawnObstacle(){
        // random for each player
        for(let zone = 1 ; zone <=2; zone++){
            if(random() <0.7){
                let xMin = (zone===1) ? 0 : width/2
                let xMax = (zone===1) ? width/2 : width
                let x = random(xMin+40, xMax-40)
                let type = random(['rock', 'barrier'])
                this.obstacles.push(new Obstacle(x, -50, type, zone))
            }
        }
    }
    render(){
        for(let ob of this.obstacles){
            ob.render()
        }
    }
}