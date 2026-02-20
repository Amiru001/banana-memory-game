const gameBoard = document.getElementById("gameBoard");

for (let i = 0; i < 16; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    gameBoard.appendChild(card);
}