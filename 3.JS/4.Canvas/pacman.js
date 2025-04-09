// Canvas 설정
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

// 상수 정의
const DEGREE_TO_RADIAN = Math.PI / 180;
const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};
const ROTATION_ANGLES = {
  [DIRECTIONS.UP]: -DEGREE_TO_RADIAN * 90,
  [DIRECTIONS.DOWN]: DEGREE_TO_RADIAN * 90,
  [DIRECTIONS.LEFT]: DEGREE_TO_RADIAN * 180,
  [DIRECTIONS.RIGHT]: 0,
};
const DIRECTION_VECTORS = {
  [DIRECTIONS.UP]: { x: 0, y: -1 },
  [DIRECTIONS.DOWN]: { x: 0, y: 1 },
  [DIRECTIONS.LEFT]: { x: -1, y: 0 },
  [DIRECTIONS.RIGHT]: { x: 1, y: 0 },
};
const KEY_MAPPINGS = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
};

// pacman 객체 정의
const pacman = {
  position: { x: 300, y: 200 },
  radius: 30,
  mouth: {
    startAngle: DEGREE_TO_RADIAN * 36,
    endAngle: DEGREE_TO_RADIAN * 324,
    maxOpenAngle: DEGREE_TO_RADIAN * 36,
    isOpening: true,
    angleSpeed: DEGREE_TO_RADIAN * 2,
  },
  movement: {
    direction: DIRECTIONS.RIGHT,
    velocity: { x: 1, y: 0 },
    speed: 2,
  },
};

// pacman 그리기 함수
function drawPacman() {
  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // pacman 그리기
  ctx.beginPath();
  ctx.moveTo(pacman.position.x, pacman.position.y);

  const rotationAngle = ROTATION_ANGLES[pacman.movement.direction];

  ctx.arc(
    pacman.position.x,
    pacman.position.y,
    pacman.radius,
    rotationAngle + pacman.mouth.startAngle,
    rotationAngle + pacman.mouth.endAngle
  );

  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath();
}

// pacman 위치 업데이트 함수
function updatePacmanPosition() {
  // 현재 방향에 따른 속도 벡터 설정
  const directionVector = DIRECTION_VECTORS[pacman.movement.direction];
  pacman.movement.velocity = directionVector;

  // 위치 업데이트
  pacman.position.x += pacman.movement.velocity.x * pacman.movement.speed;
  pacman.position.y += pacman.movement.velocity.y * pacman.movement.speed;

  // 경계 확인 및 처리
  checkBoundaries();
}

// 경계 확인 함수
function checkBoundaries() {
  if (pacman.position.x + pacman.radius > canvas.width) {
    pacman.position.x = canvas.width - pacman.radius;
  } else if (pacman.position.x - pacman.radius < 0) {
    pacman.position.x = pacman.radius;
  }

  if (pacman.position.y + pacman.radius > canvas.height) {
    pacman.position.y = canvas.height - pacman.radius;
  } else if (pacman.position.y - pacman.radius < 0) {
    pacman.position.y = pacman.radius;
  }
}

// Pacman 입 애니메이션 업데이트 함수
function updateMouthAnimation() {
  // 입이 최대로 열리거나 최소로 닫혔을 때 방향 전환
  if (
    pacman.mouth.startAngle <= 0 ||
    pacman.mouth.startAngle >= pacman.mouth.maxOpenAngle
  ) {
    pacman.mouth.isOpening = !pacman.mouth.isOpening;
  }

  // 입 각도 업데이트
  const angleChange = pacman.mouth.isOpening ? 1 : -1;
  pacman.mouth.startAngle += angleChange * pacman.mouth.angleSpeed;
  pacman.mouth.endAngle -= angleChange * pacman.mouth.angleSpeed;
}

// 애니메이션 루프 함수
function gameLoop() {
  drawPacman();
  updatePacmanPosition();
  updateMouthAnimation();

  requestAnimationFrame(gameLoop);
}

// 키보드 이벤트 처리 함수
function setupKeyboardControls() {
  window.addEventListener('keydown', (event) => {
    const newDirection = KEY_MAPPINGS[event.key];
    if (newDirection) {
      pacman.movement.direction = newDirection;
    }
  });
}

// 게임 초기화 및 시작
function initGame() {
  setupKeyboardControls();
  gameLoop();
}

// 게임 시작
initGame();
