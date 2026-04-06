const bananaPanel = document.getElementById("bananaChallenge");
const bananaImg = document.getElementById("bananaImg");
const bananaAnswer = document.getElementById("bananaAnswer");
const bananaSubmit = document.getElementById("bananaSubmit");
const bananaMsg = document.getElementById("bananaMsg");

const bonusTimeBtn = document.getElementById("bonusTimeBtn");
const triviaBox = document.getElementById("triviaBox");
const triviaQuestion = document.getElementById("triviaQuestion");
const triviaAnswers = document.getElementById("triviaAnswers");
const triviaMsg = document.getElementById("triviaMsg");

// ===== BANANA CHALLENGE =====
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
    const res = await fetch("https://marcconrad.com/uob/banana/api.php", {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    bananaImg.src = data.question;
    currentBananaSolution = String(data.solution);
    bananaMsg.textContent = "Solve the banana question to restore lives.";
  } catch (error) {
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

// ===== TRIVIA BONUS =====
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
  } catch (error) {
    triviaMsg.textContent = "Could not load trivia question.";
  }
}

function handleTriviaAnswer(selectedAnswer) {
  if (!triviaActive) return;

  const buttons = triviaAnswers.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.disabled = true;
  });

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