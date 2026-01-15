//== SELEKCIJA ELEMENATA==
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//== STANJE IGRE==
let gameState = "menu";
let gameRunning = false;

//== IGRAČ==
const playerStartRadius = 15;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: playerStartRadius,
  color: "green",
  speed: 0.1,
};

//== MIŠ==
let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

//== KRUGOVI==
let circles = [];

//== TIMER==
let totalTime = 90;
let elapsedTime = 0;
let lastTime = 0;

//== SCORE==
let score = 0;
const totalCirclesToEat = 30;

// ================= MIŠ =================
canvas.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

//vraca true false, provjerava je li odabrano mjesto safe za spawn
function isSafePosition(x, y, radius) {
  let dx = x - player.x;
  let dy = y - player.y;
  let distFromPlayer = Math.sqrt(dx * dx + dy * dy);

  if (distFromPlayer < player.radius + radius + 20) return false;

  for (let c of circles) {
    let dx2 = x - c.x;
    let dy2 = y - c.y;
    let dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    if (dist < c.radius + radius + 10) return false;
  }
  return true;
}

function createSafeCircle(minR, maxR) {
  let radius = Math.random() * (maxR - minR) + minR;
  let x, y;
  let attempts = 0;

  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    attempts++;
  } while (!isSafePosition(x, y, radius) && attempts < 50);

  return {
    x,
    y,
    radius,
    color: "orange",
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
  };
}

// ================= GAME =================
function startGame() {
  stopAllMusic();
  musicGame.play();

  gameState = "playing";
  gameRunning = true;

  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  canvas.style.display = "block";

  player.radius = playerStartRadius;
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;


  //reset misa
   mouse.x = player.x;
    mouse.y = player.y;

  circles = [];

  for (let i = 0; i < 3; i++) {
    circles.push(createSafeCircle(player.radius * 0.5, player.radius * 0.85));
  }
  for (let i = 0; i < 4; i++) {
    circles.push(createSafeCircle(player.radius * 0.9, player.radius * 1.4));
  }
  for (let i = 0; i < 3; i++) {
    circles.push(createSafeCircle(player.radius * 2.5, player.radius * 3.0));
  }

  elapsedTime = 0;
  lastTime = Date.now();
  score = 0;

  gameLoop();
}

// ================= GAME LOOP =================
function gameLoop() {
  if (!gameRunning) return;

  let now = Date.now();
  let deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}

// ================= UPDATE =================
function update(deltaTime) {
  if (gameState !== "playing") return;

  elapsedTime += deltaTime;

  if (elapsedTime >= totalTime) {
    stopGame(score >= totalCirclesToEat);
    return;
  }
  if (score >= totalCirclesToEat) {
    stopGame(true);
    return;
  }

  player.x += (mouse.x - player.x) * player.speed;
  player.y += (mouse.y - player.y) * player.speed;

  player.x = Math.max(
    player.radius,
    Math.min(canvas.width - player.radius, player.x)
  );
  player.y = Math.max(
    player.radius,
    Math.min(canvas.height - player.radius, player.y)
  );

  let speedMultiplier = 1;
  if (player.radius > 30) speedMultiplier = 1.3;
  if (player.radius > 50) speedMultiplier = 1.6;
  if (player.radius > 70) speedMultiplier = 2.0;

  let eatableCount = 0;
  for (let c of circles) {
    if (c.radius < player.radius) eatableCount++;
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];

    c.x += c.vx * speedMultiplier;
    c.y += c.vy * speedMultiplier;

    if (c.x < c.radius || c.x > canvas.width - c.radius) c.vx *= -1;
    if (c.y < c.radius || c.y > canvas.height - c.radius) c.vy *= -1;

    let dx = player.x - c.x;
    let dy = player.y - c.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.radius + c.radius) {
      if (c.radius <= player.radius) {
        player.radius += c.radius * 0.05;
        circles.splice(i, 1);
        score++;

        let minR, maxR;
        if (eatableCount < 3) {
          minR = player.radius * 0.5;
          maxR = player.radius * 0.85;
        } else {
          let rand = Math.random();
          if (rand < 0.4) {
            minR = player.radius * 0.4;
            maxR = player.radius * 0.75;
          } else if (rand < 0.75) {
            minR = player.radius * 0.9;
            maxR = player.radius * 1.4;
          } else {
            minR = player.radius * 1.8;
            maxR = player.radius * 3.0;
          }
        }
        circles.push(createSafeCircle(minR, maxR));
      } else {
        stopGame(false);
      }
    }
  }
}

// ================= DRAW =================
function draw() {
  if (gameState !== "playing") return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let c of circles) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();

  if (player.avatarImg && player.avatarImg.complete) {
    ctx.drawImage(player.avatarImg, 10, 10, 32, 32);
    ctx.fillStyle = "#fff";
    ctx.font = "20px 'Press Start 2P', cursive";
    ctx.fillText(player.nickname, 50, 30);
    ctx.fillText("Time: " + Math.ceil(totalTime - elapsedTime), 10, 60);
    ctx.fillText("Score: " + score + " / " + totalCirclesToEat, 10, 90);
  }
}

// ================= STOP GAME =================
function stopGame(win) {
  stopAllMusic();

  gameRunning = false;
  gameState = "end";

  if (win) {
    musicWin.currentTime = 0;
    musicWin.play();
    document.getElementById("winScreen").style.display = "flex";
    canvas.style.display = "none";
  } else {
    musicLose.currentTime = 0;
    musicLose.play();
    document.getElementById("gameOverScreen").style.display = "flex";
    canvas.style.display = "none";
  }

  const winNewGameBtn = document.getElementById("winNewGameBtn");
  winNewGameBtn.onclick = function () {
    stopAllMusic();
    
    resetNicknameScreen();
    document.getElementById("winScreen").style.display = "none";
    startScreen.style.display = "none";
    canvas.style.display = "none";
    mainTitleScreen.style.display = "flex";
  };

  const restartBtn = document.getElementById("restartBtn");
  restartBtn.onclick = function () {
    document.getElementById("gameOverScreen").style.display = "none";
    startGame();
  };

  const newGameBtn = document.getElementById("newGameBtn");
  newGameBtn.onclick = function () {
    stopAllMusic();
    
    resetNicknameScreen();
    document.getElementById("gameOverScreen").style.display = "none";
    startScreen.style.display = "none";
    canvas.style.display = "none";
    mainTitleScreen.style.display = "flex";
  };
}
