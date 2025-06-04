// Snake Game 
// Sukhjit Kaur

const startScreen = document.getElementById('startScreen');
const gameCanvas = document.getElementById('gameCanvas');
const canvas = gameCanvas;
const ctx = canvas.getContext("2d");
const drink = new Image();
drink.src = 'drink.png';
//const snakeImage = new Image();
//snakeImage.src = 'snake.png';
const gridSize = 20;
const tileCount = canvas.width / gridSize; // dynamically calculates based on canvas size or any changes

// for shaking/moving text
let shakeOffset = 0; 
let shakeDirection = 1;
let shakeCounter = 0;

let hasStartedOnce = false; // checks if game has been started once
let snake, dx, dy, nextDx, nextDy, started, gameOver, food, score; // initialize variables
let gameInterval; 
let gameSpeed = 100; // default speed, higher number = slower

// function setSpeedAndStart(speed) { // for difficulty levels
//     gameSpeed = speed;
//     document.getElementById('startScreen').style.display = 'none';
//     document.getElementById('gameCanvas').style.display = 'block';
//     startGame();
//   }

// when clicked, begin game
startScreen.addEventListener('click', () => {
  startScreen.style.display = 'none';    
  gameCanvas.style.display = 'block';    

  startGame();
  hasStartedOnce = true;
});

// randomly place food
function randomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

// reset variables when game resets
function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  dx = 1;
  dy = 0;
  nextDx = 1;
  nextDy = 0;
  started = true;
  gameOver = false;
  food = randomFood();
  score = 0;
}

// start/run the game
function startGame() {
  resetGame();

  if (!gameInterval) {
    gameInterval = setInterval(gameLoop, 100); // Run game loop
  }
}

// update where the snake is moving along the canvas
function updateSnake() {
  dx = nextDx;
  dy = nextDy;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount
  ) {
    gameOver = true;
    return;
  }

  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      return;
    }
  }

  // remove where the head was in previous frame
  snake.unshift(head);

  // if the head of the snake hits the food, 'drinks/eats', add 1 point to the score and place a new food
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    food = randomFood();
  } else {
    snake.pop(); // remove where the tail was
  }
}

// draw the snake body
function drawSnake() {
    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? "#228B22" : "#32CD32"; // darker head
      ctx.beginPath();
      ctx.arc(
        part.x * gridSize + gridSize / 2,
        part.y * gridSize + gridSize / 2,
        gridSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
    });
  }

// draw the food/insert image as food
function drawFood() {
    const sizeMultiplier = 1.8;
    const drawSize = gridSize * sizeMultiplier;
  
    ctx.drawImage(
      drink,
      food.x * gridSize - (drawSize - gridSize) / 2,
      food.y * gridSize - (drawSize - gridSize) / 2,
      drawSize,
      drawSize
    );
}

// draw the scoring counter
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 25);
}

// draw the game over segment 
function drawGameOver() {
    const baseX = canvas.width / 2;
    const yTop = canvas.height / 2 - 20;
    const yBottom = canvas.height / 2 + 20;
  
    // shake the game over sign! update shake offset every frame
    shakeCounter++;
    if (shakeCounter % 1 === 0) { // update every frame
      shakeOffset += shakeDirection * 6; // bigger numbers is a bigger shake/move
      if (Math.abs(shakeOffset) > 15) shakeDirection *= -1; // pixel max amplitude
    }

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("☠️ Game Over! ☠️", baseX + shakeOffset, yTop);
  ctx.font = "20px Arial";
  ctx.fillText("Press Enter to Try Again 🐍", baseX, yBottom);
}

// loop the game by continuially calling the functions 
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas

  if (!started) return;

  if (gameOver) {
    drawGameOver();
    return;
  }

  updateSnake();
  drawSnake();
  drawFood();
  drawScore();
}

// Keyboard controls
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (gameOver && key === "Enter") {
    resetGame(); // reset without showing start screen again
    return;
  }

  // game controls 
  if (key === "ArrowUp" && dy === 0) {
    nextDx = 0;
    nextDy = -1;
  } else if (key === "ArrowDown" && dy === 0) {
    nextDx = 0;
    nextDy = 1;
  } else if (key === "ArrowLeft" && dx === 0) {
    nextDx = -1;
    nextDy = 0;
  } else if (key === "ArrowRight" && dx === 0) {
    nextDx = 1;
    nextDy = 0;
  }
});
