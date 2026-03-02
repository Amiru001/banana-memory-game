// ====== DOM ======
const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");

const bananaPanel = document.getElementById("bananaChallenge");
const bananaImg = document.getElementById("bananaImg");
const bananaAnswer = document.getElementById("bananaAnswer");
const bananaSubmit = document.getElementById("bananaSubmit");
const bananaMsg = document.getElementById("bananaMsg");

// ====== GAME STATE ======
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let score = 0;

let lives = 3;
let level = 1;

let timeLeft = 60;
let timerId = null;

let currentBananaSolution = null;
let challengeActive = false;

// Level settings
const levelSettings = {
  1: { pairs: 4, time: 45 },
  2: { pairs: 6, time: 50 },
  3: { pairs: 8, time: 60 },
};

let values = [];

// ====== UI ======
function updateHUD() {
  movesEl.textContent = moves;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  timeEl.textContent = timeLeft;
  levelEl.textContent = level;
}

// ====== TIMER ======
function startTimer() {
  if (timerId) return;

  timerId = setInterval(() => {
    timeLeft--;

    // Stop exactly at 0
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
  livesEl.textContent = lives;

  // If still have lives, just retry level (NO banana challenge)
  if (lives > 0) {
    alert("Time out! You lost 1 life. Try again.");
    restartLevel();
    return;
  }

  // If lives reached 0, show Banana challenge
  showBananaChallenge("No lives left! Solve this Banana challenge to continue.");
}

// ====== BANANA CHALLENGE ======
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
    bananaMsg.textContent = "Solve the banana question to retry the level.";
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

// ====== LEVEL / BOARD ======
function applyLevelSettings() {
  const settings = levelSettings[level];
  resetTimer(settings.time);
  levelEl.textContent = level;
  updateHUD();
}

function buildBoard() {
  const settings = levelSettings[level];

  // Build pairs for this level
  values = [];
  for (let i = 1; i <= settings.pairs; i++) {
    values.push(i);
    values.push(i);
  }

  // Shuffle
  values.sort(() => Math.random() - 0.5);

  // Clear board
  gameBoard.innerHTML = "";

  // Create cards
  values.forEach((value) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;
    card.dataset.matched = "false";
    card.textContent = "?";

    card.addEventListener("click", () => handleCardClick(card));
    gameBoard.appendChild(card);
  });

  resetTurn();
  startTimer();
  updateHUD();
}

// ====== GAMEPLAY ======
function handleCardClick(card) {
  if (lockBoard) return;
  if (card === firstCard) return;
  if (card.dataset.matched === "true") return;

  // Flip
  card.textContent = card.dataset.value;

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  // Count a move when second card is chosen
  moves++;
  movesEl.textContent = moves;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    firstCard.dataset.matched = "true";
    secondCard.dataset.matched = "true";

    // Score
    score += 10;
    scoreEl.textContent = score;

    resetTurn();
    checkLevelComplete();
  } else {
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
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

    alert("Level Completed!");

    if (level < 3) {
      level++;
      applyLevelSettings();
      buildBoard();
    } else {
      alert("You finished all levels! 🎉");
    }
  }
}

// ====== RESTARTS ======
function restartLevel() {
  clearInterval(timerId);
  timerId = null;

  applyLevelSettings();
  buildBoard();
}

function restartGame() {
  clearInterval(timerId);
  timerId = null;

  level = 1;
  lives = 3;
  moves = 0;
  score = 0;

  applyLevelSettings();
  buildBoard();
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// ====== BANANA SUBMIT ======
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

    // If lives already reached 0, restart full game
    if (lives <= 0) {
      alert("Correct! Restarting the game.");
      restartGame();
    } else {
      alert("Correct! Retrying the level.");
      restartLevel(); // Option C
    }
  } else {
    bananaMsg.textContent = "Wrong answer. Try again (new question loaded).";
    fetchBananaQuestion();
  }
});

// ====== START GAME ======
applyLevelSettings();
buildBoard();