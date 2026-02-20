const gameBoard = document.getElementById("gameBoard");

let firstCard = null;
let secondCard = null;
let lockBoard = false;

const values = [];
for (let i = 1; i <= 8; i++) {
  values.push(i);
  values.push(i);
}

values.sort(() => Math.random() - 0.5);

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

  card.textContent = card.dataset.value;

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.style.pointerEvents = "none";
    secondCard.style.pointerEvents = "none";
    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}