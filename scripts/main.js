// The browser will catch common JavaScript mistakes.
"use strict";

// Constants for the stage size.
const stageWidth = 450;
const stageLength = 700;

// Creating the game canvas.
const app = new PIXI.Application(stageWidth, stageLength);
app.renderer.backgroundColor = 0x898989;
document.body.appendChild(app.view);

// Preloading the images.
PIXI.loader.add(["media/car.png", "media/cone.png", "media/heart.png"]).load(setup);

// Loading the sounds.
let music = new Howl({
  src: ['sounds/music.wav'],
  autoplay: true,
  loop: true
});

let hitSound = new Howl({
  src: ['sounds/hit.mp3'],
});

let startSound = new Howl({
  src: ['sounds/start.mp3'],
});

// Game variables.
let stage;
let gameScene;
let gameOverScene;

let titleLabel;
let instructionsLabel;
let scoreLabel;
let gameOverLabel;
let finalScoreLabel;
let bestScoreLabel;
let finalInstructionsLabel;

let car;
let obstacles = [];
let score = 0;
let life = 3;
let paused = true;
let counter = 0;
let hit = false;
let hitCounter = 0;
let midline = [];

// let music;
// let startSound;
// let hitSound;

let best = localStorage.getItem("best");

// Function for creating all labels.
function createLabels() {
  // Creating the title label for the start scene.
  titleLabel = new PIXI.Text("NERVEWRECKED");
  titleLabel.style = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 45,
    fontFamily: "Racing Sans One",
    stroke: 0x000000,
    strokeThickness: 5
  });
  titleLabel.x = (stageWidth / 2) - (titleLabel.width / 2);
  titleLabel.y = 200;
  gameScene.addChild(titleLabel);

  // Creating the instructions label for the start scene.
  instructionsLabel = new PIXI.Text("PRESS SPACEBAR TO BEGIN");
  instructionsLabel.style = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 25,
    fontFamily: "Roboto",
    fontWeight: "bold",
    stroke: 0x000000,
    strokeThickness: 5,
    align: "center"
  });
  instructionsLabel.x = (stageWidth / 2) - (instructionsLabel.width / 2);
  instructionsLabel.y = 300;
  gameScene.addChild(instructionsLabel);

  // Creating the score label for the game scene.
  scoreLabel = new PIXI.Text();
  scoreLabel.style = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 35,
    fontFamily: "Roboto",
    fontWeight: "bold",
    stroke: 0x000000,
    strokeThickness: 5
  });
  scoreLabel.x = 0;
  scoreLabel.y = 100;
  gameScene.addChild(scoreLabel);

  // Creating the game over label for the game over scene.
  gameOverLabel = new PIXI.Text("Game Over");
  gameOverLabel.style = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 64,
    fontFamily: "Roboto",
    fontWeight: "bold"
  });
  gameOverLabel.x = (stageWidth / 2) - (gameOverLabel.width / 2)
  gameOverLabel.y = stageLength/2 - 160;
  gameOverScene.addChild(gameOverLabel);

  // Creating the final score label for the game over scene.
  finalScoreLabel = new PIXI.Text();
  finalScoreLabel.style = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 35,
    fontFamily: "Roboto",
    fontWeight: "bold"
  });
  finalScoreLabel.x = 135;
  finalScoreLabel.y = stageLength/2 + 50;
  gameOverScene.addChild(finalScoreLabel);

  // Creating the best score label for the game over scene.
  bestScoreLabel = new PIXI.Text();
  bestScoreLabel.style = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 35,
    fontFamily: "Roboto",
    fontWeight: "bold"
  });
  bestScoreLabel.x = 135;
  bestScoreLabel.y = 500;
  gameOverScene.addChild(bestScoreLabel);

  // Creating the instructions label for the game over scene.
  finalInstructionsLabel = new PIXI.Text("PRESS SPACEBAR TO RESTART");
  finalInstructionsLabel.style = new PIXI.TextStyle({
    fill: 0xFFFFFF,
    fontSize: 25,
    fontFamily: "Roboto",
    fontWeight: "bold",
    align: "center"
  });
  finalInstructionsLabel.x = (stageWidth / 2) - (finalInstructionsLabel.width / 2);
  finalInstructionsLabel.y = 300;
  gameOverScene.addChild(finalInstructionsLabel);
}

// Keyboard controls.
const right = keyboard(39);
const left = keyboard(37);
const spacebar = keyboard(32);
right.press = () => {
  car.dx = 5;
}
right.release = () => {
  if (car.dx > 0) {
    car.dx = 0;
  }
}
left.press = () => {
  car.dx = -5;
}
left.release = () => {
  if (car.dx < 0) {
    car.dx = 0;
  }
}
spacebar.press = () => {
  startGame();
}

// Function for spawing cones.
function spawnCone() {
  let cone = new Cone((Math.random() * ((stageWidth - 90) - 50) + 50), -25, 5);
  obstacles.push(cone);
  gameScene.addChild(cone);
}

// Function for starting the game.
function startGame() {
  startSound.play();
  paused = false;
  gameScene.removeChild(titleLabel);
  gameScene.removeChild(instructionsLabel);
  gameOverScene.visible = false;
  gameScene.visible = true;
}

// Setup function.
function setup() {
	stage = app.stage;

	// Creating the game scene.
  gameScene = new PIXI.Container();
  gameScene.visible = true;
  stage.addChild(gameScene);

	// Creating the game over scene.
  gameOverScene = new PIXI.Container();
  gameOverScene.visible = false;
  stage.addChild(gameOverScene);

  // Creating the road.
  let road = new PIXI.Graphics();
  road.beginFill(0x595959);
  road.drawRect(50, 0, (stageWidth - 100), stageLength);
  road.endFill();
  gameScene.addChild(road);

  // Creating the midline.
  for (let i = -1; i < 8; i++) {
    let line = new PIXI.Graphics();
    line.beginFill(0xFFFFFF);
    line.drawRect((stageWidth / 2) - 5, i * 100, 10, 50);
    line.endFill();
    midline.push(line);
  }
  for (let line of midline) {
    gameScene.addChild(line);
  }

	// Creating the car.
  car = new Car(280, stageLength - 225, 0, "media/car.png");
  gameScene.addChild(car);

  // Creating all labels for all scenes.
  createLabels();

	// Calling the game loop.
  app.ticker.add(gameLoop);
}

// Main game loop function.
function gameLoop() {
  // Increasing the counter.
  counter++;

	// Calculating delta time.
  let dt = 1/app.ticker.FPS;
  if (dt > 1/12) {
    dt = 1/12;
  }

	// Moving the car.
  car.x += car.dx;

  // Restricting the car to the screen.
  if (car.x < 50) {
    car.x = 50;
  }
  if (car.x > (stageWidth - 50) - car.width) {
    car.x = (stageWidth - 50) - car.width;
  }

  // Scrolling the midline.
  for (let line of midline) {
    line.y += 5;
    if (line.y > 99) {
      line.y = -100;
    }
  }

  if (paused)  {
    return;
  }

  // Scrolling the obstacles down the screen.
  for (let cone of obstacles) {
    cone.y += cone.dy;
    if (cone.y - 25 > stageLength) {
      obstacles.shift();
    }
  }

  // Spawing the cones at a set frequency.
  if (counter % 50 == 0) {
    spawnCone();
  }

  // Check for collisions.
  for (let cone of obstacles) {
    if (collisionCheck(car, cone)) {
      obstacles.splice(obstacles.indexOf(cone), 1)
      cone.visible = false;
      hit = true;
      hitSound.play();
      life--;
      if (life == 2) {
        car.texture = PIXI.Texture.fromImage("media/car2.png");
      }
      else if (life == 1) {
        car.texture = PIXI.Texture.fromImage("media/car3.png");
      }
    }
  }

  // Flashing the car if a cone has been hit.
  if (hit == true) {
    if (hitCounter < 7) {
      car.visible = false;
    }
    else {
      car.visible = true;
      hit = false;
      hitCounter = 0;
    }
    hitCounter++;
  }

  // Increasing score.
  if (counter % 10 == 0) {
    score++;
    scoreLabel.text = `${score}`;
  }

  // Adjusting the centering for the score when it increases.
  scoreLabel.x = (stageWidth / 2) - (scoreLabel.width / 2);

  // Checking if life reaches 0.
  if (life == 0) {
    gameOver();
  }

  // Keeping the score on top of everything.
  gameScene.removeChild(scoreLabel);
  gameScene.addChild(scoreLabel);
}

// Game over function.
function gameOver() {
  paused = true;

  // Stopping the game loop.
  app.ticker.remove(gameLoop);

  // Changing the background color.
  app.renderer.backgroundColor = 0x960300;

  // Making the scene visible.
  gameOverScene.visible = true;
  gameScene.visible = false;

  // Displaying the final score.
  finalScoreLabel.text = `FINAL: ${score}`;
  finalScoreLabel.style.x = (stageWidth / 2) - (finalScoreLabel.width / 2);

  // Setting the the high score.
  if (best !== null) {
    if (score > best) {
      localStorage.setItem("best", score);
    }
  }
  else {
    best = score;
    localStorage.setItem("best", score);
  }

  // Displaying the high score.
  bestScoreLabel.text = `BEST: ${best}`;
  bestScoreLabel.style.x = (stageWidth / 2) - (bestScoreLabel.width / 2);

  // Pressing the spacebar will now reload the page.
  spacebar.press = () => {
    location.reload();
  }
}
