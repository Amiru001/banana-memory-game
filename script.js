const gameBoard = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
let score = 0;
const scoreEl = document.getElementById("score");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;

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

    // ADD THESE TWO LINES 👇
    score += 10;
    scoreEl.textContent = score;

    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      resetTurn();
    }, 900);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}