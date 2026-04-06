const loginBox = document.getElementById("loginBox");
const authTitle = document.getElementById("authTitle");
const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const emailGroup = document.getElementById("emailGroup");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const toggleAuthModeBtn = document.getElementById("toggleAuthMode");
const logoutBtn = document.getElementById("logoutBtn");
const loginMsg = document.getElementById("loginMsg");
const welcomeBar = document.getElementById("welcomeBar");
const welcomeText = document.getElementById("welcomeText");

// ===== CURRENT USER =====
let currentUser = null;
let isSignupMode = false;


function showVerificationMessageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const verified = params.get("verified");

  if (!verified) return;

  if (typeof landingPage !== "undefined" && landingPage) {
    landingPage.classList.add("hidden");
  }

  if (typeof gameContainer !== "undefined" && gameContainer) {
    gameContainer.classList.remove("hidden");
  }

  if (loginBox) {
    loginBox.classList.remove("hidden");
  }

  if (welcomeBar) {
    welcomeBar.classList.add("hidden");
  }

  if (typeof gameArea !== "undefined" && gameArea) {
    gameArea.classList.add("hidden");
  }

  setAuthMode("login");

  if (verified === "success") {
    loginMsg.textContent = "Email verified successfully. Please log in.";
  } else if (verified === "invalid") {
    loginMsg.textContent = "Invalid or expired verification link.";
  } else if (verified === "error") {
    loginMsg.textContent = "Verification failed. Please try again.";
  }

  const cleanUrl = window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
}

// ===== MODE SWITCH =====
function clearAuthFields() {
  usernameEl.value = "";
  if (emailEl) emailEl.value = "";
  passwordEl.value = "";
  loginMsg.innerHTML = "";
}

function setAuthMode(mode) {
  isSignupMode = mode === "signup";

  if (isSignupMode) {
    authTitle.textContent = "PLAYER SIGN UP";
    emailGroup.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    signupBtn.classList.remove("hidden");
    toggleAuthModeBtn.textContent = "Back to login";
  } else {
    authTitle.textContent = "PLAYER LOGIN";
    emailGroup.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    signupBtn.classList.add("hidden");
    toggleAuthModeBtn.textContent = "Create new account";
  }

  loginMsg.innerHTML = "";
}

toggleAuthModeBtn?.addEventListener("click", () => {
  clearAuthFields();
  setAuthMode(isSignupMode ? "login" : "signup");
});

// ===== AUTH HELPERS =====
async function getCurrentUserFromSession() {
  try {
    const res = await fetch("get_user.php");
    const data = await res.json();

    if (data.success) {
      currentUser = data.user;
      return data.user;
    }

    currentUser = null;
    return null;
  } catch (error) {
    currentUser = null;
    return null;
  }
}

function isLoggedIn() {
  return currentUser !== null;
}

async function updateBestScore() {
  if (!currentUser) return;

  try {
    await fetch("save_score.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        score: score,
        moves: moves
      })
    });
  } catch (error) {
    console.error("Failed to save best result");
  }
}

// ===== LOGIN UI =====
async function updateLoginUI() {
  const user = await getCurrentUserFromSession();

  if (user) {
    loginBox?.classList.add("hidden");
    welcomeBar?.classList.remove("hidden");

    if (welcomeText) {
      welcomeText.textContent = `Welcome, ${user.username}! 💥Best Score: ${user.best_score}💥`;
    }

    if (typeof gameArea !== "undefined" && gameArea) {
      gameArea.classList.remove("hidden");
    }
    } else {
    loginBox?.classList.remove("hidden");
    welcomeBar?.classList.add("hidden");

    if (typeof gameArea !== "undefined" && gameArea) {
      gameArea.classList.add("hidden");
    }

    setAuthMode("login");
    showVerificationMessageFromUrl();
  }
}

// ===== SIGN UP =====
signupBtn?.addEventListener("click", async () => {
  const username = usernameEl.value.trim();
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  if (!username || !email || !password) {
    loginMsg.textContent = "Enter username, email, and password.";
    return;
  }

  try {
    const res = await fetch("signup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await res.json();

    if (data.success) {
      loginMsg.textContent = "Signup successful. Please check your email and verify your account.";
    } else {
      loginMsg.textContent = data.message;
      playSound(wrongSound);
    }
  } catch (error) {
    loginMsg.textContent = "Signup request failed.";
    playSound(wrongSound);
  }
});

// ===== LOGIN =====
loginBtn?.addEventListener("click", async () => {
  const username = usernameEl.value.trim();
  const password = passwordEl.value.trim();

  if (!username || !password) {
    loginMsg.textContent = "Enter username and password.";
    return;
  }

  try {
    const res = await fetch("login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await res.json();

    if (data.success) {
      loginMsg.textContent = "";
      await updateLoginUI();
      if (typeof loadLeaderboard === "function") {
  loadLeaderboard();
}

      if (typeof startFreshGame === "function") {
        startFreshGame();
      }
    } else {
      loginMsg.textContent = data.message;
      playSound(wrongSound);
    }
  } catch (error) {
    loginMsg.textContent = "Login request failed.";
    playSound(wrongSound);
  }
});

// ===== LOGOUT =====
logoutBtn?.addEventListener("click", async () => {
  await updateBestScore();

  try {
    await fetch("logout.php");
  } catch (error) {
    console.error("Logout request failed");
  }

  currentUser = null;

  if (typeof timerId !== "undefined") {
    clearInterval(timerId);
    timerId = null;
  }

  await updateLoginUI();
});