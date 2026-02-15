class Game{
    constructor(){
        this.state = 'MENU'
        // players
        this.players = []
        // track
        this.track = null
        this.ui = null
        //managers(obstacles, effects)
        this.obstacleManager = null
        this.collisonManager = null
        //controllers
        this.controllers = []
        this.frameCount = 0
        this.init()
    }
    

    /**
     * initialise all elements in the game 
     */
    init(){
        // track 
        this.track = new Track()

        // IF Muiltiplayer 
        // initial players at starting pos
        this.players[0] = new Player(1, width*0.25, height-100)
        this.players[1] = new Player(2, width*0.75, height-100)

        //Obstacles 
        this.obstacleManager = new ObstacleManager()
        this.collisonManager = new CollisionManager()
        // UI
        this.ui = new UI()
        
        // controllers
        this.controllers[0] = new Controller(1)
        this.controllers[1] = new Controller(2)
        this.frameCount =0
       
    }

    // ----------------------------game logic----------------
    update(){
        if(this.state === 'PLAYING'){
            this.controllers[0].updateInputData()
            this.controllers[1].updateInputData()

            this.players[0].updateInputs(this.controllers[0].getInputData())
            this.players[1].updateInputs(this.controllers[1].getInputData())
            // track
            this.track.update()
            // heart-lives
            //obstacles
            //  checkEndGame(winning/ game over)
            
            this.obstacleManager.update()
            for(let player of this.players){
                player.update()
            }
            
            // detect collision
            this.collisonManager.checkCollision(this.players, this.obstacleManager.obstacles)

            this.checkEndGame()

            this.frameCount++
        }
    }

    render(){
        // render all game elements on screen
        // track 
        this.track.render()
        this.obstacleManager.render()   //manager

        // players
        for(let player of this.players){

            player.render()
        }

        this.ui.render(this.players, this.state)        //UI
        // console.log(`Game state: ${game.state}`)
    }

    startGame(){
        this.state = 'PLAYING'
        // console.log(`Game state: ${game.state}`)
    }
    checkEndGame(){
         // Check if either player is out of health
        for (let player of this.players) {
            if (player.heart <= 0) {
                this.state = 'GAME_OVER'
                console.log('Game Over!')
                }
            }
        
            // Or check time limit (60 seconds)
            if (this.frameCount > 3600) { // 60 seconds at 60fps
                this.state = 'GAME_OVER'
                console.log('Time Up!')
        }
    }
    handleKeyPressed(key){

    }
}