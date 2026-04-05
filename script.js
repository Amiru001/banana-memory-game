
const cursor = document.getElementById("cursor");
const dot = document.getElementById("cursorDot");

let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  if (dot) {
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  }
});

(function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  if (cursor) {
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
  }
  requestAnimationFrame(animateCursor);
})();


const canvas = document.getElementById("particles");
const ctx = canvas ? canvas.getContext("2d") : null;
let W = 0;
let H = 0;
let pts = [];

function resizeCanvas() {
  if (!canvas) return;
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (canvas && ctx) {
  for (let i = 0; i < 80; i++) {
    pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      color: Math.random() > 0.5 ? "124,58,237" : "34,211,238"
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

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
}


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
  document.querySelectorAll("[data-target]").forEach((el) => {
    animateCounter(el, parseInt(el.dataset.target, 10));
  });
}, 900);

// DEMO TILE
const injectedStyle = document.createElement("style");
injectedStyle.textContent = `
@keyframes tileIn {
  from { opacity: 0; transform: scale(0.6) rotateY(90deg); }
  to { opacity: 1; transform: scale(1) rotateY(0deg); }
}`;
document.head.appendChild(injectedStyle);


const tileInners = document.querySelectorAll(".demo-tile .tile-inner");
let autoFlipIdx = 0;
let activeDemo = null;

setInterval(() => {
  if (tileInners.length === 0) return;

  if (activeDemo !== null && tileInners[activeDemo]) {
    tileInners[activeDemo].style.transform = "";
  }

  activeDemo = autoFlipIdx;

  if (tileInners[autoFlipIdx]) {
    tileInners[autoFlipIdx].style.transform = "rotateY(180deg)";
  }

  setTimeout(() => {
    if (tileInners[autoFlipIdx]) {
      tileInners[autoFlipIdx].style.transform = "";
    }
    activeDemo = null;
  }, 1200);

  autoFlipIdx = (autoFlipIdx + 1) % tileInners.length;
}, 2000);

// MODAL 
const overlay = document.getElementById("modalOverlay");
const openInstructions = document.getElementById("openInstructions");
const modalClose = document.getElementById("modalClose");
const modalPlay = document.getElementById("modalPlay");

openInstructions?.addEventListener("click", (e) => {
  e.preventDefault();
  overlay?.classList.add("active");
});

modalClose?.addEventListener("click", () => overlay?.classList.remove("active"));

overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.remove("active");
});

// DOM 
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


const levelCompleteModal = document.getElementById("levelCompleteModal");
const completedLevelText = document.getElementById("completedLevelText");
const completedScoreText = document.getElementById("completedScoreText");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const closeLevelModal = document.getElementById("closeLevelModal");

const bonusTimeBtn = document.getElementById("bonusTimeBtn");
const triviaBox = document.getElementById("triviaBox");
const triviaQuestion = document.getElementById("triviaQuestion");
const triviaAnswers = document.getElementById("triviaAnswers");
const triviaMsg = document.getElementById("triviaMsg");

const pauseBtn = document.getElementById("pauseBtn");
const pauseModal = document.getElementById("pauseModal");
const resumeBtn = document.getElementById("resumeBtn");


// CURSOR HOVER
document.querySelectorAll("a, button, .demo-tile, .diff-badge, .modal-close, input").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (cursor) cursor.style.transform = "translate(-50%,-50%) scale(1.6)";
  });
  el.addEventListener("mouseleave", () => {
    if (cursor) cursor.style.transform = "translate(-50%,-50%) scale(1)";
  });
});



let selectedDifficulty = "easy";

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let isPaused = false;

let moves = 0;
let score = 0;
let lives = 0;
let level = 1;

let timeLeft = 0;
let timerId = null;

let currentBananaSolution = null;
let challengeActive = false;

let nextLevelBonusTime = 0;
let triviaBonusUsed = false;
let triviaActive = false;
let currentTriviaAnswer = "";

const levelSettings = {
  1: { pairs: 4, time: 20, lives: 2 },
  2: { pairs: 6, time: 35, lives: 2 },
  3: { pairs: 8, time: 45, lives: 3 }
};

const emojiPool = [
  { id: 1, icon: "🍌" },
  { id: 2, icon: "🍓" },
  { id: 3, icon: "🍇" },
  { id: 4, icon: "🍍" },
  { id: 5, icon: "🍉" },
  { id: 6, icon: "🍊" },
  { id: 7, icon: "🍎" },
  { id: 8, icon: "🥝" }
];

// UI 
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
  }, 2200);
}


// LANDING 
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

playNowBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  openGameScreen();
});

modalPlay?.addEventListener("click", (e) => {
  e.preventDefault();
  overlay?.classList.remove("active");
  openGameScreen();
});

homeBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  landingPage.scrollIntoView({ behavior: "smooth" });
});

backToMenuBtn?.addEventListener("click", () => {
  stopAll();
  gameContainer.classList.add("hidden");
  landingPage.classList.remove("hidden");
  statusMsg.textContent = "";
});


// PAUSE
function showPauseModal() {
  pauseModal.classList.remove("hidden");
}

function hidePauseModal() {
  pauseModal.classList.add("hidden");
}

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

pauseBtn?.addEventListener("click", pauseGame);
resumeBtn?.addEventListener("click", resumeGame);

// GAME START/LEVEL SETUP
function startFreshGame() {
  moves = 0;
  score = 0;
  isPaused = false;
  nextLevelBonusTime = 0;

  hideBananaChallenge();
  hideLevelCompleteModal();
  hidePauseModal();

  startLevel(level, true, 0);
}

function startLevel(targetLevel, resetLives, bonusTime) {
  const settings = levelSettings[targetLevel];
  level = targetLevel;

  if (resetLives) {
    lives = settings.lives;
  }

  resetTimer(settings.time + bonusTime);
  buildBoard();
  updateHUD();
}

function buildBoard() {
  const settings = levelSettings[level];
  const selected = emojiPool.slice(0, settings.pairs);

  const values = [];
  selected.forEach((item) => {
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
    emoji.textContent = selected.find((x) => x.id === id)?.icon || "🍌";

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
}

// TIMER 
function startTimer() {
  if (timerId || isPaused) return;

  timerId = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      timeLeft = 0;
      updateHUD();
      clearInterval(timerId);
      timerId = null;
      handleTimeout();
      return;
    }

    updateHUD();
  }, 1000);
}

function resetTimer(newTime) {
  clearInterval(timerId);
  timerId = null;
  timeLeft = newTime;
}

function handleTimeout() {
  lives--;
  updateHUD();

  if (lives > 0) {
    showStatus("Time out! You lost 1 life.", "warning");
    playSound(wrongSound);
    restartLevel();
    return;
  }

  playSound(wrongSound);
  showBananaChallenge("No lives left! Solve this Banana challenge to continue.");
}

// BANANA CHALLENGE
function showBananaChallenge(reasonText) {
  clearInterval(timerId);
  timerId = null;
  lockBoard = true;
  challengeActive = true;

  bananaMsg.textContent = `${reasonText} (Loading...)`;
  bananaAnswer.value = "";
  bananaImg.src = "";
  bananaPanel.classList.remove("hidden");

  fetchBananaQuestion();
}

async function fetchBananaQuestion() {
  try {
    const res = await fetch("https://marcconrad.com/uob/banana/api.php", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    bananaImg.src = data.question;
    currentBananaSolution = String(data.solution);
    bananaMsg.textContent = "Solve the banana question to restore lives.";
  } catch {
    bananaMsg.textContent = "Failed to load Banana API. Check internet and try again.";
    currentBananaSolution = null;
  }
}

function hideBananaChallenge() {
  bananaPanel.classList.add("hidden");
  challengeActive = false;
  lockBoard = false;
}

bananaSubmit?.addEventListener("click", () => {
  if (!challengeActive) return;

  if (currentBananaSolution === null) {
    bananaMsg.textContent = "No question loaded. Please try again.";
    fetchBananaQuestion();
    return;
  }

  const userAns = String(bananaAnswer.value || "").trim();

  if (userAns === currentBananaSolution) {
    hideBananaChallenge();
    lives = levelSettings[level].lives;
    updateHUD();
    showStatus("Correct! Lives restored.", "success");
    restartLevel(true);
  } else {
    bananaMsg.textContent = "Wrong answer. Try again.";
    playSound(wrongSound);
    fetchBananaQuestion();
  }
});

// TRIVIA BONUS
function decodeHtml(text) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

async function fetchTriviaQuestion() {
  try {
    triviaActive = true;
    triviaMsg.textContent = "Loading question...";
    triviaBox.classList.remove("hidden");
    triviaAnswers.innerHTML = "";

    const res = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      triviaMsg.textContent = "Could not load trivia question.";
      return;
    }

    const q = data.results[0];
    currentTriviaAnswer = decodeHtml(q.correct_answer);
    triviaQuestion.textContent = decodeHtml(q.question);

    const answers = [...q.incorrect_answers, q.correct_answer]
      .map((a) => decodeHtml(a))
      .sort(() => Math.random() - 0.5);

    triviaAnswers.innerHTML = "";
    answers.forEach((answer) => {
      const btn = document.createElement("button");
      btn.classList.add("trivia-answer-btn");
      btn.textContent = answer;
      btn.type = "button";
      btn.addEventListener("click", () => handleTriviaAnswer(answer));
      triviaAnswers.appendChild(btn);
    });

    triviaMsg.textContent = "";
  } catch {
    triviaMsg.textContent = "Could not load trivia question.";
  }
}

function handleTriviaAnswer(selectedAnswer) {
  if (!triviaActive) return;

  const buttons = triviaAnswers.querySelectorAll("button");
  buttons.forEach((btn) => btn.disabled = true);

  if (selectedAnswer === currentTriviaAnswer) {
    nextLevelBonusTime = 10;
    triviaMsg.textContent = "Correct! You earned +10 seconds for the next level.";
    triviaMsg.className = "trivia-msg status-msg success";
  } else {
    nextLevelBonusTime = 0;
    triviaMsg.textContent = "Wrong answer. No bonus time.";
    triviaMsg.className = "trivia-msg status-msg error";
    playSound(wrongSound);
  }

  triviaActive = false;
  bonusTimeBtn.disabled = true;
}

bonusTimeBtn?.addEventListener("click", () => {
  if (triviaBonusUsed || level >= 3) return;

  triviaBonusUsed = true;
  bonusTimeBtn.disabled = true;
  fetchTriviaQuestion();
});

// LEVEL COMPLETE MODAL
function showLevelCompleteModal() {
  completedLevelText.textContent = level;
  completedScoreText.textContent = score;
  nextLevelBtn.textContent = level < 3 ? "Next Level →" : "Finish →";

  triviaBonusUsed = false;
  triviaActive = false;
  currentTriviaAnswer = "";
  nextLevelBonusTime = 0;

  triviaBox.classList.add("hidden");
  triviaQuestion.textContent = "";
  triviaAnswers.innerHTML = "";
  triviaMsg.textContent = "";
  triviaMsg.className = "trivia-msg";

  if (level < 3) {
    bonusTimeBtn.classList.remove("hidden");
    bonusTimeBtn.disabled = false;
  } else {
    bonusTimeBtn.classList.add("hidden");
  }

  lockBoard = true;
  levelCompleteModal.classList.remove("hidden");
  playSound(levelUpSound);
}

function hideLevelCompleteModal() {
  levelCompleteModal.classList.add("hidden");
  lockBoard = false;
}

function goToNextLevelOrFinish() {
  hideLevelCompleteModal();

  if (level < 3) {
    const nextLevel = level + 1;
    const bonus = nextLevelBonusTime;
    startLevel(nextLevel, true, bonus);

    if (bonus > 0) {
      showStatus("Bonus applied! +10 seconds added.", "success");
    } else {
      showStatus("Next level started!", "success");
    }
  } else {
    updateBestScore();
    showStatus("You finished all levels! 🎉", "success");
  }
}

nextLevelBtn?.addEventListener("click", goToNextLevelOrFinish);
closeLevelModal?.addEventListener("click", goToNextLevelOrFinish);

// GAMEPLAY
function handleCardClick(card) {
  if (lockBoard) return;
  if (isPaused) return;
  if (card === firstCard) return;
  if (card.dataset.matched === "true") return;
  if (!card.classList.contains("is-hidden")) return;

  card.classList.remove("is-hidden");
  playSound(flipSound);

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
    firstCard.dataset.matched = "true";
    secondCard.dataset.matched = "true";

    score += 10;
    updateHUD();

    firstCard.classList.add("is-match");
    secondCard.classList.add("is-match");

    setTimeout(() => {
      firstCard.classList.add("is-gone");
      secondCard.classList.add("is-gone");
      resetTurn();
      checkLevelComplete();
    }, 600);
  } else {
    playSound(wrongSound);

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
    updateBestScore();
    showLevelCompleteModal();
  }
}

// RESTART/STOP
function restartLevel(fromRecovery = false) {
  clearInterval(timerId);
  timerId = null;
  isPaused = false;
  hidePauseModal();
  hideLevelCompleteModal();

  startLevel(level, false, 0);

  if (fromRecovery) {
    showStatus("Level restarted. Good luck!", "success");
  }
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