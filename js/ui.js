const overlay = document.getElementById("modalOverlay");
const openInstructions = document.getElementById("openInstructions");
const modalClose = document.getElementById("modalClose");
const modalPlay = document.getElementById("modalPlay");

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

const levelCompleteModal = document.getElementById("levelCompleteModal");
const completedLevelText = document.getElementById("completedLevelText");
const completedScoreText = document.getElementById("completedScoreText");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const closeLevelModal = document.getElementById("closeLevelModal");

const pauseBtn = document.getElementById("pauseBtn");
const pauseModal = document.getElementById("pauseModal");
const resumeBtn = document.getElementById("resumeBtn");

// ===== UI HELPERS =====
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

function showPauseModal() {
  pauseModal.classList.remove("hidden");
}

function hidePauseModal() {
  pauseModal.classList.add("hidden");
}

function showLevelCompleteModal() {
  const bonusTimeBtn = document.getElementById("bonusTimeBtn");
  const triviaBox = document.getElementById("triviaBox");
  const triviaQuestion = document.getElementById("triviaQuestion");
  const triviaAnswers = document.getElementById("triviaAnswers");
  const triviaMsg = document.getElementById("triviaMsg");

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

  if (isLoggedIn()) {
    startFreshGame();
  }
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

// ===== MODAL EVENTS =====
openInstructions?.addEventListener("click", (e) => {
  e.preventDefault();
  overlay?.classList.add("active");
});

modalClose?.addEventListener("click", () => {
  overlay?.classList.remove("active");
});

overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});

// ===== CURSOR HOVER =====
document.querySelectorAll("a, button, .demo-tile, .diff-badge, .modal-close, input").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    const cursorEl = document.getElementById("cursor");
    if (cursorEl) cursorEl.style.transform = "translate(-50%,-50%) scale(1.6)";
  });

  el.addEventListener("mouseleave", () => {
    const cursorEl = document.getElementById("cursor");
    if (cursorEl) cursorEl.style.transform = "translate(-50%,-50%) scale(1)";
  });
});



// ===== LANDING / UI EVENTS =====
diffBadges.forEach((badge) => {
  badge.addEventListener("click", () => {
    diffBadges.forEach((b) => b.classList.remove("active"));
    badge.classList.add("active");
    selectedDifficulty = badge.dataset.difficulty;
  });
});

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

pauseBtn?.addEventListener("click", () => {
  pauseGame();
});

resumeBtn?.addEventListener("click", () => {
  resumeGame();
});

nextLevelBtn?.addEventListener("click", () => {
  goToNextLevelOrFinish();
});

closeLevelModal?.addEventListener("click", () => {
  goToNextLevelOrFinish();
});


