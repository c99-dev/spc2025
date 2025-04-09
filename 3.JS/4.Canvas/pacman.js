const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

let pacman = {
  x: 300,
  y: 200,
  radius: 30,
  startAngle: 0.2 * Math.PI,
  endAngle: 1.8 * Math.PI,
  mouseOpen: 1,
  angleSpeed: 0.01 * Math.PI,
  direction: 'right',
  directionX: 1,
  directionY: 0,
  speed: 2,
};

function drawPacman() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(pacman.x, pacman.y);
  ctx.arc(
    pacman.x,
    pacman.y,
    pacman.radius,
    pacman.startAngle,
    pacman.endAngle
  );
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath();
}

function updatePacmanPosition() {
  switch (pacman.direction) {
    case 'up':
      pacman.directionX = 0;
      pacman.directionY = -1;
      break;
    case 'down':
      pacman.directionX = 0;
      pacman.directionY = 1;
      break;
    case 'left':
      pacman.directionX = -1;
      pacman.directionY = 0;
      break;
    case 'right':
      pacman.directionX = 1;
      pacman.directionY = 0;
      break;
  }

  pacman.x += pacman.directionX * pacman.speed;
  pacman.y += pacman.directionY * pacman.speed;

  if (pacman.x + pacman.radius > canvas.width) {
    pacman.x = canvas.width - pacman.radius;
  } else if (pacman.x - pacman.radius < 0) {
    pacman.x = pacman.radius;
  } else if (pacman.y + pacman.radius > canvas.height) {
    pacman.y = canvas.height - pacman.radius;
  } else if (pacman.y - pacman.radius < 0) {
    pacman.y = pacman.radius;
  }
}

function updateMouseAngle() {
  switch (pacman.direction) {
    case 'up':
      break;
    case 'down':
      break;
    case 'left':
      if (
        pacman.startAngle <= 0.75 * Math.PI ||
        pacman.startAngle >= 1.25 * Math.PI
      ) {
        pacman.mouseOpen *= -1;
      }
      pacman.startAngle += pacman.mouseOpen * pacman.angleSpeed;
      pacman.endAngle -= pacman.mouseOpen * pacman.angleSpeed;
      break;
    case 'right':
      if (pacman.startAngle <= 0 || pacman.startAngle >= 0.25 * Math.PI) {
        pacman.mouseOpen *= -1;
      }
      pacman.startAngle += pacman.mouseOpen * pacman.angleSpeed;
      pacman.endAngle -= pacman.mouseOpen * pacman.angleSpeed;
      break;
  }
}

function animate() {
  drawPacman();
  updatePacmanPosition();
  updateMouseAngle();

  requestAnimationFrame(animate);
}

function handleKeyDown() {
  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        pacman.direction = 'up';
        break;
      case 'ArrowDown':
        pacman.direction = 'down';
        break;
      case 'ArrowLeft':
        pacman.direction = 'left';
        break;
      case 'ArrowRight':
        pacman.direction = 'right';
        break;
    }
  });
}

handleKeyDown();
animate();
