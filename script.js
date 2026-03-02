const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
let score = 0;
const scoreEl = document.getElementById("score");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;

let lives = 3;
let timeLeft = 60;
let timerId = null;

const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");

livesEl.textContent = lives;
timeEl.textContent = timeLeft;

// Create 8 pairs (16 cards). Later we will replace values with banana images.
const values = [];
for (let i = 1; i <= 8; i++) {
  values.push(i);
  values.push(i);
}

// Shuffle
values.sort(() => Math.random() - 0.5);

// Build cards
gameBoard.innerHTML = "";
values.forEach((value) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.value = value;
  card.textContent = "?";

  card.addEventListener("click", () => handleCardClick(card));
  gameBoard.appendChild(card);
});

startTimer();

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

  moves++;
  movesEl.textContent = moves;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    firstCard.dataset.matched = "true";
    secondCard.dataset.matched = "true";

    
    score += 10;
    scoreEl.textContent = score;

    checkLevelComplete(); 

    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      resetTurn();
    }, 900);
  }
}

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

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  timeLeft = 60;
  timeEl.textContent = timeLeft;
}

function handleTimeout() {
  loseLife("Time out!");
}

function loseLife(message) {
  lives--;
  livesEl.textContent = lives;

  alert(message + " You lost 1 life.");

  if (lives <= 0) {
    alert("Game Over!");
    restartLevel();
  } else {
    restartLevel();
  }
}

function restartLevel() {
  // Reset turn state
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  // Reset timer
  resetTimer();

  // Reset board (hide cards again)
  const cards = document.querySelectorAll(".card");
  cards.forEach((c) => {
    c.textContent = "?";
    c.dataset.matched = "false";
  });

  // Shuffle again for fairness (optional)
  values.sort(() => Math.random() - 0.5);
  cards.forEach((card, idx) => {
    card.dataset.value = values[idx];
  });

  // Start timer again
  startTimer();
}

function checkLevelComplete() {
  const matchedCards = document.querySelectorAll('.card[data-matched="true"]').length;
  const totalCards = document.querySelectorAll(".card").length;

  if (matchedCards === totalCards) {
    clearInterval(timerId);
    timerId = null;
    alert("Level Completed!");
    
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}