// MINIMAL TEST - Flash this to micro:bit to verify serial communication
// This removes ALL display conflicts

let lastCommand = "NONE"

// Show startup
basic.showString("TEST")
basic.pause(1000)
basic.clearScreen()

// Listen for commands - THIS IS THE ONLY THING CONTROLLING THE DISPLAY
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let command = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    lastCommand = command
    
    // Show what we received
    basic.clearScreen()
    
    if (command === "HAPPY") {
        basic.showIcon(IconNames.Happy)
    } else if (command === "SAD") {
        basic.showIcon(IconNames.Sad)
    } else {
        // Show the actual text we received for debugging
        basic.showString(command)
    }
})

// Send data every 500ms (slower for easier debugging)
basic.forever(function () {
    let tiltX = input.acceleration(Dimension.X)
    let btnA = input.buttonIsPressed(Button.A) ? 1 : 0
    let btnB = input.buttonIsPressed(Button.B) ? 1 : 0
    
    let data = tiltX + "," + btnA + "," + btnB + ",0,255"
    serial.writeLine(data)
    
    basic.pause(500)
})

// Button A - manually trigger happy
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Happy)
    basic.pause(2000)
    basic.clearScreen()
})

// Button B - show last command received
input.onButtonPressed(Button.B, function () {
    basic.showString(lastCommand)
    basic.pause(2000)
    basic.clearScreen()
})