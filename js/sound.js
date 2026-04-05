const clickSound = new Audio("sounds/buttonPress.mp3");
const flipSound = new Audio("sounds/flipcard.mp3");
const wrongSound = new Audio("sounds/error.mp3");
const levelUpSound = new Audio("sounds/levelCleared.mp3");

function playSound(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

document.querySelectorAll("button, a").forEach((el) => {
  el.addEventListener("click", () => playSound(clickSound));
});