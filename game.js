const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const restartBtn = document.getElementById('restartBtn');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GRAVITY = 0.22;
const WALL_BOUNCE = 0.92;
const BUMPER_BOUNCE = 1.04;
const FLIPPER_BOUNCE = 1.18;

const keys = {
  left: false,
  right: false,
};

const bumpers = [
  { x: 160, y: 180, r: 24, score: 100, glow: '#5eead4' },
  { x: 320, y: 200, r: 26, score: 125, glow: '#f59e0b' },
  { x: 240, y: 300, r: 22, score: 150, glow: '#60a5fa' },
];

const state = {
  score: 0,
  gameOver: false,
  ball: null,
  flippers: null,
};

function createBall() {
  return {
    x: WIDTH / 2 + 40,
    y: 90,
    vx: 2.6,
    vy: 1.4,
    r: 10,
  };
}

function createFlippers() {
  return {
    left: {
      pivotX: 175,
      pivotY: 640,
      length: 84,
      width: 16,
      restAngle: 0.38,
      activeAngle: -0.34,
      angle: 0.38,
      active: false,
      side: 'left',
      color: '#fb7185',
    },
    right: {
      pivotX: 305,
      pivotY: 640,
      length: 84,
      width: 16,
      restAngle: Math.PI - 0.38,
      activeAngle: Math.PI + 0.34,
      angle: Math.PI - 0.38,
      active: false,
      side: 'right',
      color: '#5eead4',
    },
  };
}

function resetGame() {
  state.score = 0;
  state.gameOver = false;
  state.ball = createBall();
  state.flippers = createFlippers();
  updateHud();
}

function updateHud() {
  scoreEl.textContent = String(state.score);
  statusEl.textContent = state.gameOver ? 'Game Over' : 'Playing';
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateFlipper(flipper) {
  flipper.active = flipper.side === 'left' ? keys.left : keys.right;
  const target = flipper.active ? flipper.activeAngle : flipper.restAngle;
  flipper.angle += (target - flipper.angle) * 0.24;
}

function getFlipperTip(flipper) {
  return {
    x: flipper.pivotX + Math.cos(flipper.angle) * flipper.length,
    y: flipper.pivotY + Math.sin(flipper.angle) * flipper.length,
  };
}

function collideWall(ball) {
  if (ball.x - ball.r <= 18) {
    ball.x = 18 + ball.r;
    ball.vx = Math.abs(ball.vx) * WALL_BOUNCE;
  }

  if (ball.x + ball.r >= WIDTH - 18) {
    ball.x = WIDTH - 18 - ball.r;
    ball.vx = -Math.abs(ball.vx) * WALL_BOUNCE;
  }

  if (ball.y - ball.r <= 18) {
    ball.y = 18 + ball.r;
    ball.vy = Math.abs(ball.vy) * WALL_BOUNCE;
  }
}

function collideBumpers(ball) {
  bumpers.forEach((bumper) => {
    const dx = ball.x - bumper.x;
    const dy = ball.y - bumper.y;
    const dist = Math.hypot(dx, dy);
    const minDist = ball.r + bumper.r;

    if (dist < minDist) {
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);
      const overlap = minDist - dist;
      ball.x += nx * overlap;
      ball.y += ny * overlap;

      const dot = ball.vx * nx + ball.vy * ny;
      ball.vx = (ball.vx - 2 * dot * nx) * BUMPER_BOUNCE;
      ball.vy = (ball.vy - 2 * dot * ny) * BUMPER_BOUNCE;

      state.score += bumper.score;
      updateHud();
    }
  });
}

function collideFlipper(ball, flipper) {
  const tip = getFlipperTip(flipper);
  const segX = tip.x - flipper.pivotX;
  const segY = tip.y - flipper.pivotY;
  const segLenSq = segX * segX + segY * segY;
  const t = clamp(
    ((ball.x - flipper.pivotX) * segX + (ball.y - flipper.pivotY) * segY) / segLenSq,
    0,
    1,
  );

  const closestX = flipper.pivotX + segX * t;
  const closestY = flipper.pivotY + segY * t;
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  const dist = Math.hypot(dx, dy);
  const hitRadius = ball.r + flipper.width / 2;

  if (dist < hitRadius) {
    const nx = dx / (dist || 1);
    const ny = dy / (dist || 1);
    const overlap = hitRadius - dist;
    ball.x += nx * overlap;
    ball.y += ny * overlap;

    const dot = ball.vx * nx + ball.vy * ny;
    ball.vx = ball.vx - 2 * dot * nx;
    ball.vy = ball.vy - 2 * dot * ny;

    const lift = flipper.active ? 6.2 : 3.2;
    const sideBoost = flipper.side === 'left' ? -1.4 : 1.4;
    ball.vy -= lift * FLIPPER_BOUNCE;
    ball.vx += sideBoost * (flipper.active ? 1.1 : 0.55);

    state.score += flipper.active ? 20 : 5;
    updateHud();
  }
}

function updateBall(ball) {
  ball.vy += GRAVITY;
  ball.x += ball.vx;
  ball.y += ball.vy;

  collideWall(ball);
  collideBumpers(ball);
  collideFlipper(ball, state.flippers.left);
  collideFlipper(ball, state.flippers.right);

  if (ball.y - ball.r > HEIGHT) {
    state.gameOver = true;
    updateHud();
  }
}

function drawPlayfield() {
  ctx.save();
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.35)';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, WIDTH - 36, HEIGHT - 36);

  ctx.beginPath();
  ctx.moveTo(18, 560);
  ctx.lineTo(110, 700);
  ctx.moveTo(WIDTH - 18, 560);
  ctx.lineTo(WIDTH - 110, 700);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();
}

function drawBumpers() {
  bumpers.forEach((bumper) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(bumper.x, bumper.y, bumper.r + 10, 0, Math.PI * 2);
    ctx.fillStyle = `${bumper.glow}22`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bumper.x, bumper.y, bumper.r, 0, Math.PI * 2);
    ctx.fillStyle = bumper.glow;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.stroke();
    ctx.restore();
  });
}

function drawFlipper(flipper) {
  const tip = getFlipperTip(flipper);
  ctx.save();
  ctx.strokeStyle = flipper.color;
  ctx.lineWidth = flipper.width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(flipper.pivotX, flipper.pivotY);
  ctx.lineTo(tip.x, tip.y);
  ctx.stroke();

  ctx.fillStyle = '#dbeafe';
  ctx.beginPath();
  ctx.arc(flipper.pivotX, flipper.pivotY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBall(ball) {
  ctx.save();
  const gradient = ctx.createRadialGradient(ball.x - 3, ball.y - 4, 2, ball.x, ball.y, ball.r + 4);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.4, '#dbeafe');
  gradient.addColorStop(1, '#60a5fa');
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawTexts() {
  ctx.save();
  ctx.fillStyle = 'rgba(229, 238, 252, 0.82)';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Use ← → to flip, R to restart', WIDTH / 2, 40);

  if (state.gameOver) {
    ctx.fillStyle = 'rgba(7, 17, 31, 0.8)';
    ctx.fillRect(95, 295, 290, 120);
    ctx.strokeStyle = 'rgba(251, 113, 133, 0.85)';
    ctx.lineWidth = 3;
    ctx.strokeRect(95, 295, 290, 120);

    ctx.fillStyle = '#fb7185';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('GAME OVER', WIDTH / 2, 345);
    ctx.fillStyle = '#e5eefc';
    ctx.font = '18px Arial';
    ctx.fillText('Press R to restart', WIDTH / 2, 382);
  }
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawPlayfield();
  drawBumpers();
  drawFlipper(state.flippers.left);
  drawFlipper(state.flippers.right);
  drawBall(state.ball);
  drawTexts();
}

function loop() {
  updateFlipper(state.flippers.left);
  updateFlipper(state.flippers.right);

  if (!state.gameOver) {
    updateBall(state.ball);
  }

  draw();
  requestAnimationFrame(loop);
}

function setControlPressed(side, pressed) {
  keys[side] = pressed;
  const btn = side === 'left' ? leftBtn : rightBtn;
  if (btn) btn.classList.toggle('is-active', pressed);
}

function bindPressHold(button, side) {
  if (!button) return;

  const press = (event) => {
    if (event) event.preventDefault();
    setControlPressed(side, true);
  };

  const release = (event) => {
    if (event) event.preventDefault();
    setControlPressed(side, false);
  };

  button.addEventListener('pointerdown', press, { passive: false });
  button.addEventListener('pointerup', release, { passive: false });
  button.addEventListener('pointercancel', release, { passive: false });
  button.addEventListener('pointerleave', release, { passive: false });
  button.addEventListener('lostpointercapture', release, { passive: false });

  button.addEventListener('touchstart', press, { passive: false });
  button.addEventListener('touchend', release, { passive: false });
  button.addEventListener('touchcancel', release, { passive: false });
  button.addEventListener('mousedown', press);
  button.addEventListener('mouseup', release);
  button.addEventListener('mouseleave', release);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    setControlPressed('left', true);
    event.preventDefault();
  } else if (event.key === 'ArrowRight') {
    setControlPressed('right', true);
    event.preventDefault();
  } else if (event.key.toLowerCase() === 'r') {
    resetGame();
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') {
    setControlPressed('left', false);
  } else if (event.key === 'ArrowRight') {
    setControlPressed('right', false);
  }
});

bindPressHold(leftBtn, 'left');
bindPressHold(rightBtn, 'right');
restartBtn?.addEventListener('click', () => resetGame());

resetGame();
loop();
