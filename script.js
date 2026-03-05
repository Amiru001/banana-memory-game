// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursorDot');

let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

(function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
})();

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, pts = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 80; i++) {
  pts.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random(),
    color: Math.random() > 0.5 ? '124,58,237' : '34,211,238'
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.a * 0.7})`;
    ctx.fill();
  });

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== COUNTERS =====
function animateCounter(el, target, duration = 1600) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

setTimeout(() => {
  document.querySelectorAll('[data-target]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.target, 10));
  });
}, 900);

// ===== TILE ENTRY =====
const style = document.createElement('style');
style.textContent = `
@keyframes tileIn {
  from { opacity:0; transform: scale(0.6) rotateY(90deg); }
  to { opacity:1; transform: scale(1) rotateY(0deg); }
}`;
document.head.appendChild(style);

// ===== TILE AUTO FLIP DEMO =====
const tileInners = document.querySelectorAll('.tile .tile-inner');
let autoFlipIdx = 0;
let activeDemo = null;

setInterval(() => {
  if (tileInners.length === 0) return;
  if (activeDemo !== null) tileInners[activeDemo].style.transform = '';
  activeDemo = autoFlipIdx;
  tileInners[autoFlipIdx].style.transform = 'rotateY(180deg)';

  setTimeout(() => {
    if (tileInners[autoFlipIdx]) tileInners[autoFlipIdx].style.transform = '';
    activeDemo = null;
  }, 1200);

  autoFlipIdx = (autoFlipIdx + 1) % tileInners.length;
}, 2000);

// ===== MODAL =====
const overlay = document.getElementById('modalOverlay');
const openInstructions = document.getElementById('openInstructions');
const modalClose = document.getElementById('modalClose');
const modalPlay = document.getElementById('modalPlay');

openInstructions.addEventListener('click', e => {
  e.preventDefault();
  overlay.classList.add('active');
});
modalClose.addEventListener('click', () => overlay.classList.remove('active'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });

// ===== DOM =====
const landingPage = document.getElementById("landingPage");
const gameContainer = document.getElementById("gameContainer");
const gameArea = document.getElementById("gameArea");
const playNowBtn = document.getElementById("playNow");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const homeBtn = document.getElementById("homeBtn");

const diffBadges = document.querySelectorAll(".diff-badge");

const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");
const statusMsg = document.getElementById("statusMsg");

const bananaPanel = document.getElementById("bananaChallenge");
const bananaImg = document.getElementById("bananaImg");
const bananaAnswer = document.getElementById("bananaAnswer");
const bananaSubmit = document.getElementById("bananaSubmit");
const bananaMsg = document.getElementById("bananaMsg");

const loginBox = document.getElementById("loginBox");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginMsg = document.getElementById("loginMsg");
const welcomeBar = document.getElementById("welcomeBar");
const welcomeText = document.getElementById("welcomeText");

const levelCompleteModal = document.getElementById("levelCompleteModal");
const completedLevelText = document.getElementById("completedLevelText");
const completedScoreText = document.getElementById("completedScoreText");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const closeLevelModal = document.getElementById("closeLevelModal");

const pauseBtn = document.getElementById("pauseBtn");
const pauseModal = document.getElementById("pauseModal");
const resumeBtn = document.getElementById("resumeBtn");

// ===== CURSOR HOVER =====
document.querySelectorAll('a, button, .tile, .diff-badge, .modal-close, input, .next-level-btn, .close-level-modal, .pause-btn, .resume-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.6)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ===== GAME STATE =====
let selectedDifficulty = "easy";

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let isPaused = false;

let moves = 0;
let score = 0;
let lives = 3;
let level = 1;

let timeLeft = 60;
let timerId = null;

let currentBananaSolution = null;
let challengeActive = false;
let values = [];

const levelSettings = {
  1: { pairs: 4, time: 45 },
  2: { pairs: 6, time: 50 },
  3: { pairs: 8, time: 60 }
};

// ✅ Emoji set (acts like your images)
const emojiPool = [
  { id: 1, icon: "🍌" },
  { id: 2, icon: "🍓" },
  { id: 3, icon: "🍇" },
  { id: 4, icon: "🍍" },
  { id: 5, icon: "🍉" },
  { id: 6, icon: "🍊" },
  { id: 7, icon: "🍎" },
  { id: 8, icon: "🥝" },
];

// ===== UI =====
function updateHUD() {
  movesEl.textContent = moves;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  timeEl.textContent = timeLeft;
  levelEl.textContent = level;
}

function showStatus(text, type = "success") {
  statusMsg.textContent = text;
  statusMsg.className = `status-msg ${type}`;
  setTimeout(() => {
    if (statusMsg.textContent === text) {
      statusMsg.textContent = "";
      statusMsg.className = "status-msg";
    }
  }, 1800);
}

// ===== LOGIN =====
function isLoggedIn() {
  return localStorage.getItem("bm_user") !== null;
}

function setLoggedInUser(username) {
  localStorage.setItem("bm_user", username);
}

function logout() {
  localStorage.removeItem("bm_user");
  clearInterval(timerId);
  timerId = null;
  location.reload();
}

function updateLoginUI() {
  const user = localStorage.getItem("bm_user");

  if (user) {
    loginBox.classList.add("hidden");
    welcomeBar.classList.remove("hidden");
    welcomeText.textContent = `Welcome, ${user}! ✅`;
    gameArea.classList.remove("hidden");
  } else {
    loginBox.classList.remove("hidden");
    welcomeBar.classList.add("hidden");
    gameArea.classList.add("hidden");
  }
}

// ===== LANDING PAGE =====
diffBadges.forEach((badge) => {
  badge.addEventListener("click", () => {
    diffBadges.forEach((b) => b.classList.remove("active"));
    badge.classList.add("active");
    selectedDifficulty = badge.dataset.difficulty;
  });
});

function setLevelFromDifficulty() {
  if (selectedDifficulty === "easy") level = 1;
  else if (selectedDifficulty === "medium") level = 2;
  else level = 3;
}

function openGameScreen() {
  setLevelFromDifficulty();
  landingPage.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  updateLoginUI();

  if (isLoggedIn()) startFreshGame();
}

playNowBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openGameScreen();
});

modalPlay.addEventListener('click', e => {
  e.preventDefault();
  overlay.classList.remove('active');
  openGameScreen();
});

homeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  landingPage.scrollIntoView({ behavior: "smooth" });
});

backToMenuBtn.addEventListener("click", () => {
  stopAll();
  gameContainer.classList.add("hidden");
  landingPage.classList.remove("hidden");
  statusMsg.textContent = "";
});

loginBtn.addEventListener("click", () => {
  const u = usernameEl.value.trim();
  const p = passwordEl.value.trim();

  if (!u || !p) {
    loginMsg.textContent = "Enter username and password.";
    return;
  }

  setLoggedInUser(u);
  loginMsg.textContent = "";
  updateLoginUI();
  startFreshGame();
});

logoutBtn.addEventListener("click", logout);

// ===== PAUSE =====
function showPauseModal() { pauseModal.classList.remove("hidden"); }
function hidePauseModal() { pauseModal.classList.add("hidden"); }

function pauseGame() {
  if (isPaused) return;
  if (!isLoggedIn()) return;
  if (gameArea.classList.contains("hidden")) return;
  if (!bananaPanel.classList.contains("hidden")) return;
  if (!levelCompleteModal.classList.contains("hidden")) return;

  isPaused = true;
  lockBoard = true;
  clearInterval(timerId);
  timerId = null;
  showPauseModal();
}

function resumeGame() {
  if (!isPaused) return;
  isPaused = false;
  lockBoard = false;
  hidePauseModal();
  startTimer();
}

pauseBtn.addEventListener("click", pauseGame);
resumeBtn.addEventListener("click", resumeGame);

// ===== GAME =====
function startFreshGame() {
  moves = 0;
  score = 0;
  lives = 3;
  isPaused = false;

  hideBananaChallenge();
  hideLevelCompleteModal();
  hidePauseModal();

  applyLevelSettings();
  buildBoard();
}

function applyLevelSettings() {
  const settings = levelSettings[level];
  resetTimer(settings.time);
  updateHUD();
}

// ✅ BUILD BOARD WITH EMOJIS (instead of numbers)
function buildBoard() {
  const settings = levelSettings[level];

  const selected = emojiPool.slice(0, settings.pairs);

  values = [];
  selected.forEach(item => {
    values.push(item.id);
    values.push(item.id);
  });

  values.sort(() => Math.random() - 0.5);
  gameBoard.innerHTML = "";

  values.forEach((id) => {
    const card = document.createElement("div");
    card.classList.add("card", "is-hidden");
    card.dataset.value = String(id);
    card.dataset.matched = "false";

    // 🔥 Flip structure
    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-face", "card-front");

    const back = document.createElement("div");
    back.classList.add("card-face", "card-back");

    const cover = document.createElement("div");
    cover.classList.add("card-cover");
    cover.textContent = "?";

    const emoji = document.createElement("div");
    emoji.classList.add("card-emoji");
    emoji.textContent = selected.find(x => x.id === id).icon;

    front.appendChild(cover);
    back.appendChild(emoji);

    inner.appendChild(front);
    inner.appendChild(back);

    card.appendChild(inner);

    card.addEventListener("click", () => handleCardClick(card));
    gameBoard.appendChild(card);
  });

  resetTurn();
  startTimer();
  updateHUD();
}

// ===== TIMER =====
function startTimer() {
  if (timerId || isPaused) return;

  timerId = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      timeLeft = 0;
      timeEl.textContent = timeLeft;
      clearInterval(timerId);
      timerId = null;
      handleTimeout();
      return;
    }

    timeEl.textContent = timeLeft;
  }, 1000);
}

function resetTimer(newTime) {
  clearInterval(timerId);
  timerId = null;
  timeLeft = newTime;
  timeEl.textContent = timeLeft;
}

function handleTimeout() {
  lives--;
  updateHUD();

  if (lives > 0) {
    showStatus("Time out! 1 life lost.", "warning");
    restartLevel();
    return;
  }

  showBananaChallenge("No lives left! Solve this Banana challenge to continue.");
}

// ===== BANANA CHALLENGE =====
function showBananaChallenge(reasonText) {
  clearInterval(timerId);
  timerId = null;
  lockBoard = true;
  challengeActive = true;

  bananaMsg.textContent = reasonText + " (Loading...)";
  bananaAnswer.value = "";
  bananaImg.src = "";
  bananaPanel.classList.remove("hidden");

  fetchBananaQuestion();
}

async function fetchBananaQuestion() {
  try {
    const res = await fetch("https://marcconrad.com/uob/banana/api.php", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    bananaImg.src = data.question;
    currentBananaSolution = String(data.solution);
    bananaMsg.textContent = "Solve the banana question to restore lives.";
  } catch (err) {
    bananaMsg.textContent = "Failed to load Banana API. Check internet and try again.";
    currentBananaSolution = null;
  }
}

function hideBananaChallenge() {
  bananaPanel.classList.add("hidden");
  challengeActive = false;
  lockBoard = false;
}

bananaSubmit.addEventListener("click", () => {
  if (!challengeActive) return;

  if (currentBananaSolution === null) {
    bananaMsg.textContent = "No question loaded. Please try again.";
    fetchBananaQuestion();
    return;
  }

  const userAns = String(bananaAnswer.value).trim();

  if (userAns === currentBananaSolution) {
    hideBananaChallenge();
    lives = 3;
    updateHUD();
    showStatus("Correct! Lives restored.", "success");
    restartLevel();
  } else {
    bananaMsg.textContent = "Wrong answer. Try again.";
    fetchBananaQuestion();
  }
});

// ===== LEVEL COMPLETE MODAL =====
function showLevelCompleteModal() {
  completedLevelText.textContent = level;
  completedScoreText.textContent = score;
  nextLevelBtn.textContent = level < 3 ? "Next Level →" : "Finish →";
  lockBoard = true;
  levelCompleteModal.classList.remove("hidden");
}

function hideLevelCompleteModal() {
  levelCompleteModal.classList.add("hidden");
  lockBoard = false;
}

nextLevelBtn.addEventListener("click", () => {
  hideLevelCompleteModal();

  if (level < 3) {
    level++;
    applyLevelSettings();
    buildBoard();
    showStatus("Next level started!", "success");
  } else {
    showStatus("You finished all levels! 🎉", "success");
  }
});

closeLevelModal.addEventListener("click", () => hideLevelCompleteModal());

// ===== GAMEPLAY =====
function handleCardClick(card) {
  if (lockBoard) return;
  if (isPaused) return;
  if (card === firstCard) return;
  if (card.dataset.matched === "true") return;
  if (!card.classList.contains("is-hidden")) return; // already revealed

  // reveal emoji
  card.classList.remove("is-hidden");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  moves++;
  updateHUD();

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    // mark matched
    firstCard.dataset.matched = "true";
    secondCard.dataset.matched = "true";

    score += 10;
    updateHUD();

    // vibrate
    firstCard.classList.add("is-match");
    secondCard.classList.add("is-match");

    // then disappear
    setTimeout(() => {
      firstCard.classList.add("is-gone");
      secondCard.classList.add("is-gone");
      resetTurn();
      checkLevelComplete();
    }, 600);

  } else {
    setTimeout(() => {
      firstCard.classList.add("is-hidden");
      secondCard.classList.add("is-hidden");
      resetTurn();
    }, 900);
  }
}

function checkLevelComplete() {
  const matchedCards = document.querySelectorAll('.card[data-matched="true"]').length;
  const totalCards = document.querySelectorAll(".card").length;

  if (matchedCards === totalCards) {
    clearInterval(timerId);
    timerId = null;
    showLevelCompleteModal();
  }
}

// ===== RESTART / STOP =====
function restartLevel() {
  clearInterval(timerId);
  timerId = null;
  isPaused = false;
  hidePauseModal();
  hideLevelCompleteModal();
  applyLevelSettings();
  buildBoard();
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function stopAll() {
  clearInterval(timerId);
  timerId = null;
  isPaused = false;
  hidePauseModal();
  hideBananaChallenge();
  hideLevelCompleteModal();
}

updateLoginUI();