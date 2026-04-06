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

// ===== PAUSE =====
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

// ===== GAME START / LEVEL SETUP =====
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

// ===== TIMER =====
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

// ===== GAMEPLAY =====
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

    if (typeof loadLeaderboard === "function") {
      loadLeaderboard();
    }

    showLevelCompleteModal();
  }
}

// ===== RESTART / STOP =====
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