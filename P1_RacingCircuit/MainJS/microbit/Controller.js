class Controller{
    constructor(playerId){
        this.playerId = playerId
        this.port = null
        this.reader = null
        this.writer = null
        this.connected = false
        this.lastShakeTime = 0
        this.buffer= ''

        // input states
        this.inputData = {
            tiltX:0, buttonA: false, buttonB: false, shakeDetected: false, lightLevel:255
        }
    }

    async connect(){
        try{
            console.log(`Connecting Player ${this.playerId}... `)
        
            // setting up serial port
            this.port = await navigator.serial.requestPort()
            console.log(`Player ${this.playerId}'s port opened`)
            await this.port.open({baudRate : 115200})
            this.connected = true

            // update button UI
            const btn = document.getElementById(`microbit${this.playerId}`)
            if(btn){
                btn.textContent = `Player ${this.playerId} connected`
                btn.style.background = '#47a'
                
            }
            
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // when connected
            // this.writer = this.port.writable.getWriter()
            await this.sendSuccessEmoji()
            // Small delay before starting to read
            await new Promise(resolve => setTimeout(resolve, 100))
            
            // read sensor data 
            this.startReading()
        } catch(err){
            console.error('Connection failed: ', err)
            alert(`Failed to connect player ${this.playerId}! \n ${err.message}`)
        }
    }

    async sendSuccessEmoji(){
        try{
            console.log(`Attempting to send emoji to Player ${this.playerId}...`)
            
            // Get writer temporarily
            const writer = this.port.writable.getWriter()
            console.log(`Writer acquired for Player ${this.playerId}`)
            
            // Send command to display happy face
            const encoder = new TextEncoder()
            const data = encoder.encode('HAPPY\n')
            console.log(`Sending: HAPPY\\n to Player ${this.playerId}`)
            
            await writer.write(data)
            console.log(`Data written to Player ${this.playerId}`)
            
            // CRITICAL: Release the writer lock so reading can start
            writer.releaseLock()
            console.log(`Writer released for Player ${this.playerId}`)
            
            console.log(`✓ Successfully sent emoji to Player ${this.playerId}`)
        } catch(err){
            console.error('Error sending emoji:', err)
        }
    }

    async startReading(){
        try{
            const decoder = new TextDecoderStream()
            this.port.readable.pipeTo(decoder.writable)
            this.reader = decoder.readable.getReader()

            // read continuously
            while(true){
                const {value, done} = await this.reader.read()
                if(done) break
                this.buffer += value // process incoming data 

                // line splitting
                let lines = this.buffer.split('\n')
                this.buffer = lines.pop() // keeping incomplete lines

                // parsing complete lines 
                for(let line of lines){
                    if(line.trim()){
                        this.parseData(line.trim())
                    }
                }
            }
        }catch(err){
            console.error('Error reading serial:', err)
            this.connected = false
        }
    }
    updateInputData(){

        // keyboard for testing 
        if(!this.connected){
            this.simulateInput()
        }
    }
    simulateInput(){
        let now = millis()

        if(this.playerId ===1){

            let tilt = 0
            if(keyIsDown(LEFT_ARROW)) tilt = -500
            if(keyIsDown(RIGHT_ARROW)) tilt = 500
            this.inputData.tiltX = tilt
            this.inputData.buttonA = keyIsDown(90)      //Z
            this.inputData.buttonB = keyIsDown(88)      //X

            if(keyIsDown(67)){
                this.inputData.buttonA = true
                this.inputData.buttonB = true                
            }
            
            //S
            if(keyIsDown(83) && (now - this.lastShakeTime > 3000)){
                this.inputData.shakeDetected = true
                this.lastShakeTime = now
            }else{
                this.inputData.shakeDetected = false
            }
        }else{
            let tilt = 0
            if(keyIsDown(65)) tilt = -500
            if(keyIsDown(68)) tilt = 500
            this.inputData.tiltX = tilt
            this.inputData.buttonA = keyIsDown(81)      //Q
            this.inputData.buttonB = keyIsDown(69)      //E

            if(keyIsDown(87)){  //W
                this.inputData.buttonA = true
                this.inputData.buttonB = true                
            }
            
            if(keyIsDown(83) && (now - this.lastShakeTime > 3000)){
                this.inputData.shakeDetected = true
                this.lastShakeTime = now
            }else{
                this.inputData.shakeDetected = false
            }
        }
            
    }
    getInputData(){
        return this.inputData
    }
    parseData(data){
        const parts = data.split(',')       //tiltX
        if(parts.length == 5){
            this.inputData.tiltX = parseInt(parts[0]) || 0
            this.inputData.buttonA = parts[1] === '1'
            this.inputData.buttonB = parts[2] === '1'
            this.inputData.shakeDetected = parts[3] === '1'
            this.inputData.lightLevel = parseInt(parts[4]) ||255

            console.log(`Player ${this.playerId}: `, this.inputData)
        }
    }
    async disconnect() {

        try {
            // Send sad face before disconnecting
            if(this.port && this.port.writable){
                const writer = this.port.writable.getWriter()
                const encoder = new TextEncoder()
                const data = encoder.encode('SAD\n')
                await writer.write(data)
                writer.releaseLock()
            }
        } catch(err) {
            console.error('Error sending disconnect emoji:', err)
        }


        if(this.reader){
            try {
                await this.reader.cancel()
            } catch(err) {
                console.error('Error cancelling reader:', err)
            }
            this.reader = null
        }
        if(this.port){
            try {
                await this.port.close()
            } catch(err) {
                console.error('Error closing port:', err)
            }
            this.port = null
        }
        this.connected = false
        console.log(`Player ${this.playerId} disconnected`)
    }
}