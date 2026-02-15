// Global variables
let game;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('game-container');
  frameRate(60)
  game = new Game();
  
  // Connect micro:bit buttons
  document.getElementById('microbit1').addEventListener('click', () => {
    game.controllers[0].connect();
  });
  
  document.getElementById('microbit2').addEventListener('click', () => {
    game.controllers[1].connect();
  });

}

function draw() {
  background(50);
  game.update();
  game.render();
  
  fill(255, 255, 0);
  textSize(12);
  text(`State: ${game.state}`, 10, height - 40);
  text(`FPS: ${floor(frameRate())}`, 10, height - 20);
  text(`Obstacles: ${game.obstacleManager.obstacles.length}`, 10, height - 60);
}

function keyPressed() {
  // Start game with SPACE
  if (keyCode === 32 && game.state === 'MENU') {
    game.startGame();
  }
  
  // Restart with R
  if (keyCode === 82 && game.state === 'GAME_OVER') {
    game.init();
    game.startGame();
  }
  
  // Pause with P
  if (keyCode === 80) {
    game.state = game.state === 'PLAYING' ? 'PAUSED' : 'PLAYING';
  }
}