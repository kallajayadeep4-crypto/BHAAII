window.onload = function () {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// load image
const playerImg = new Image();
playerImg.src = "player.png";

// sound
const loseSound = document.getElementById("loseSound");

// player
let player = {
  x: 100,
  y: canvas.height / 2,
  width: 60,
  height: 60,
  velocity: 0,
  gravity: 0.5
};

// pipes
let pipes = [];
const pipeWidth = 60;
const gap = 150;

// game state
let gameOver = false;

// control
document.addEventListener("keydown", function () {
  if (!gameOver) {
    player.velocity = -8;
  }
});

// create pipes
function createPipe() {
  let topHeight = Math.random() * (canvas.height - gap - 100);

  pipes.push({
    x: canvas.width,
    top: topHeight
  });
}

// update
function update() {
  if (gameOver) return;

  player.velocity += player.gravity;
  player.y += player.velocity;

  // ground/top collision
  if (player.y + player.height > canvas.height || player.y < 0) {
    endGame();
  }

  // pipes
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];

    pipe.x -= 3;

    // collision
    if (
      player.x < pipe.x + pipeWidth &&
      player.x + player.width > pipe.x &&
      (player.y < pipe.top ||
        player.y + player.height > pipe.top + gap)
    ) {
      endGame();
    }
  }

  // remove pipes
  pipes = pipes.filter(p => p.x > -pipeWidth);
}

// draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw player (ONLY after image loads)
  if (playerImg.complete) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }

  // draw pipes
  ctx.fillStyle = "green";
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];

    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + gap, pipeWidth, canvas.height);
  }
}

// loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// start game ONLY after image loads
playerImg.onload = function () {
  setInterval(createPipe, 2000);
  gameLoop();
};

// end game
function endGame() {
  if (gameOver) return;

  gameOver = true;

  try {
    loseSound.play();
  } catch (e) {}

  alert("Game Over 😂");
}

};