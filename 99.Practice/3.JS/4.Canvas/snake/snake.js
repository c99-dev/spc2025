window.onload = initialize;

const GAME_SPEED = 200;
const BLOCK_SIZE = 20;

let gameInterval;
function initialize() {
  canvas = document.querySelector('#myCanvas');
  ctx = canvas.getContext('2d');

  snake = {
    body: [{ x: BLOCK_SIZE, y: BLOCK_SIZE }],
    direction: 'right',
  };

  food = {
    x: Math.floor(Math.random() * (canvas.width / BLOCK_SIZE)) * BLOCK_SIZE,
    y: Math.floor(Math.random() * (canvas.height / BLOCK_SIZE)) * BLOCK_SIZE,
  };

  setupEventListeners();

  gameInterval = setInterval(gameLoop, GAME_SPEED);
}

function setupEventListeners() {
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        if (snake.direction !== 'down') snake.direction = 'up';
        break;
      case 'ArrowDown':
        if (snake.direction !== 'up') snake.direction = 'down';
        break;
      case 'ArrowLeft':
        if (snake.direction !== 'right') snake.direction = 'left';
        break;
      case 'ArrowRight':
        if (snake.direction !== 'left') snake.direction = 'right';
        break;
    }
  });
}

function gameLoop() {
  moveSnake();
  draw();
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, BLOCK_SIZE, BLOCK_SIZE);
}

function drawSnake() {
  ctx.fillStyle = 'green';
  snake.body.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, BLOCK_SIZE, BLOCK_SIZE);
  });
}

function moveSnake() {
  const head = { ...snake.body[0] };

  switch (snake.direction) {
    case 'up':
      head.y -= BLOCK_SIZE;
      break;
    case 'down':
      head.y += BLOCK_SIZE;
      break;
    case 'left':
      head.x -= BLOCK_SIZE;
      break;
    case 'right':
      head.x += BLOCK_SIZE;
      break;
  }

  snake.body.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food.x =
      Math.floor(Math.random() * (canvas.width / BLOCK_SIZE)) * BLOCK_SIZE;
    food.y =
      Math.floor(Math.random() * (canvas.height / BLOCK_SIZE)) * BLOCK_SIZE;
  } else {
    snake.body.pop();
  }

  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.body
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert('Game Over!');
    initialize();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}
