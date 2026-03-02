// ====== DOM ======
const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");

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

// Level settings: pairs + time
const levelSettings = {
  1: { pairs: 4, time: 45 },
  2: { pairs: 6, time: 50 },
  3: { pairs: 8, time: 60 },
};

let values = []; // card values for the current level

// ====== UI HELPERS ======
function updateHUD() {
  movesEl.textContent = moves;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  timeEl.textContent = timeLeft;
  levelEl.textContent = level;
}

// ====== TIMER ======
function startTimer() {
  if (timerId) return; // avoid double timers

  timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      handleTimeout();
    }
  }, 1000);
}

function resetTimer(newTime) {
  clearInterval(timerId);
  timerId = null;
  timeLeft = newTime;
  timeEl.textContent = timeLeft;
}

function handleTimeout() {
  loseLife("Time out!");
}

// ====== LEVEL / BOARD ======
function applyLevelSettings() {
  const settings = levelSettings[level];
  resetTimer(settings.time);
  levelEl.textContent = level;
}

function buildBoard() {
  const settings = levelSettings[level];

  // Build values array (pairs)
  values = [];
  for (let i = 1; i <= settings.pairs; i++) {
    values.push(i);
    values.push(i);
  }

  // Shuffle
  values.sort(() => Math.random() - 0.5);

  // Clear old board
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

  // Reset turn state
  resetTurn();

  // Start timer for the level
  startTimer();

  // Update HUD
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

  // One move = picking second card
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

// ====== LIVES / RESTART ======
function loseLife(message) {
  lives--;
  livesEl.textContent = lives;

  alert(message + " You lost 1 life.");

  if (lives <= 0) {
    clearInterval(timerId);
    timerId = null;
    alert("Game Over! Restarting from Level 1.");
    restartGame();
  } else {
    restartLevel();
  }
}

function restartLevel() {
  clearInterval(timerId);
  timerId = null;

  // Reset turn
  resetTurn();

  // Reset timer for current level
  applyLevelSettings();

  // Rebuild board (reshuffle)
  buildBoard();
}

function restartGame() {
  // Reset everything
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

// ====== START GAME ======
applyLevelSettings();
updateHUD();
buildBoard();