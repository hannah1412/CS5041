class Player{
    constructor(id, x, y){
        // car's starting pos
        this.id = id 
        this.x = x
        this.y = y

        // size car onn canvas
        this.width = 40
        this.height = 60
        this.speed = 5
        this.backSpeed = 5
        this.lane = 0           // car pos on lane (-1: left, 0: center, 1: right)

        // controller input states
        this.tiltX = 0
        this.buttonA = false
        this.buttonB = false
        this.shakeDetected = false
        this.lightLevel = 255

        // player's stat
        this.score = 0
        this.heart = 4
        this.distance = 0

        // booster's activation &abilities
        this.boosts = 3     //max boosters
        this.isBooster = false
        this.hasShield = false
        this.shieldTimer = 0
    }

    // ----------------------handliong with player's pos----------------
    update(){
        // player's movemnet & abilities
        this.handleMovement()
        this.handleAbilities()
        // player's pos
        this.updateTimers()
        this.distance += this.speed
        this.constrainedPos()

    }
    handleMovement(){
        // TILT
        this.x += this.tiltX *0.5

        // BRAKE (press A)
        if(this.buttonA){
            this.speed = this.backSpeed *0.5
        }else{
            this.speed = this.backSpeed
        }

        // BOOST (press B)
        if(this.buttonB && this.boosts>0 && !this.isBooster){
            this.activateBoost()
        }
    }
    handleAbilities(){
        // SHIELD by pressing both A+ B
        if(this.buttonA && this.buttonB && !this.hasShield){
            this.activateShield()
        }

        // shake for lane jump

        if(this.shakeDetected){
            this.activateLaneJumpp()
        }
    }

    // -------------movements ------------
    activateBoost(){
        this.isBooster = true
        this.speed = this.backSpeed*2
        this.boosts--
        setTimeout( () => {
            this.isBooster = false
            this.speed = this.backSpeed
        }, 2000)
    }
    
    // ------------abilities -----------------
    activateShield(){
        this.hasShield = true
        this.shieldTimer = 120      // ms at 60fps
    }
    activateLaneJumpp(){
        // jump on x-axis
        this.x += (this.tiltX > 0 ? 100: -100)
    }

    // -------------update-------------------
    updateTimers(){
        if(this.shieldTimer >0){
            this.shieldTimer--
            if(this.shieldTimer === 0){
                this.hasShield = false
            }
        }
    }
    constrainedPos(){
        let minX = (this.id === 1) ? 0 : width/2
        let maxX = (this.id === 1) ? width/2 : width
        this.x = constrain(this.x, minX+this.width/2, maxX - this.width/2)
    }


    // for controller
    updateInputs(inputData){
        this.tiltX = inputData.tiltX
        this.buttonA = inputData.buttonA
        this.buttonB = inputData.buttonB
        this.shakeDetected = inputData.shakeDetected
        this.lightLevel = inputData.lightLevel
    }

    // for Collision manager 
    takeDamage(){
        if(!this.hasShield){
            this.heart--
        }else{
            this.hasShield = false
            this.shieldTimer = 0
        }
    }
    addScore(pts){
        this.score +=pts
    }

    render(){
        push();

        // player's shield state 
        if(this.hasShield){
            fill(100, 200,255, 100)
            ellipse(this.x, this.y, this.width+20, this.height+20)
        }

        // car shape
        fill(this.id === 1 ? color(255, 100,100) : color(100, 100, 255))
        rect(this.x - this.width/2,  this.y - this.height/2, this.width, this.height,5)

        // booster tracking 
        if(this.isBooster){
            fill(255,150, 0,150)
            for (let i=1; i<4 ;i++){
                ellipse(this.x, this.y +this.height/2 + i *10, 20, 10)
            }
        }
        pop();
    }
}