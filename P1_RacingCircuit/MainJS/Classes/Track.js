class Track{

    constructor(){
        this.segments = []  // track segments 
        this.scrollSpeed = 5
        this.dividerOffset = 0
        this.offset = 0

    }
    render(){
        // background
        fill(40,40, 40)
        rect(0,0, width, height)

        // draw split screen
        stroke(255, 255, 0)
        strokeWeight(3)
        line(width/2, 0, width/2, height)

        // draw lane divider
        this.renderLaneMarker();
        noStroke()
    }
    
    update(){
        this.offset +=this.scrollSpeed
        this.dividerOffset += this.scrollSpeed*2
    }
    renderLaneMarker(){
        stroke(255)
        strokeWeight(2)
        let dashHeight = 30
        let dashGap = 20

        for(let y= -dashHeight  + (this.dividerOffset % (dashHeight+dashGap));
                y<height; y+= dashHeight+dashGap){
            // player 1s lane
            line(width*0.25, y, width*0.25, y+dashHeight)
            // p2 lane
            line(width*0.75, y, width*0.75, y+dashHeight)
        }
    }

}