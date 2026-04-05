const loginBox = document.getElementById("loginBox");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const pinEl = document.getElementById("pin");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginMsg = document.getElementById("loginMsg");
const welcomeBar = document.getElementById("welcomeBar");
const welcomeText = document.getElementById("welcomeText");

// ===== AUTH HELPERS =====
function loadUsers() {
  return JSON.parse(localStorage.getItem("bm_users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("bm_users", JSON.stringify(users));
}

function getDeviceId() {
  let id = localStorage.getItem("bm_device_id");

  if (!id) {
    id = window.crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : `dev_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    localStorage.setItem("bm_device_id", id);
  }

  return id;
}

function generateToken() {
  return window.crypto && crypto.randomUUID
    ? `bm_${crypto.randomUUID()}`
    : `bm_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function loadSessions() {
  return JSON.parse(localStorage.getItem("bm_sessions") || "{}");
}

function saveSessions(sessions) {
  localStorage.setItem("bm_sessions", JSON.stringify(sessions));
}

function setSessionToken(token) {
  localStorage.setItem("bm_session_token", token);
}

function getSessionToken() {
  return localStorage.getItem("bm_session_token");
}

function clearSessionToken() {
  localStorage.removeItem("bm_session_token");
}

function getCurrentUserFromToken() {
  const token = getSessionToken();
  if (!token) return null;

  const sessions = loadSessions();
  return sessions[token] || null;
}

function isLoggedIn() {
  return getCurrentUserFromToken() !== null;
}

function invalidateCurrentSession() {
  const token = getSessionToken();
  if (!token) return;

  const sessions = loadSessions();

  if (sessions[token]) {
    delete sessions[token];
    saveSessions(sessions);
  }

  clearSessionToken();
}

function updateBestScore() {
  const user = getCurrentUserFromToken();
  if (!user) return;

  const users = loadUsers();
  if (!users[user]) return;

  const best = Number(users[user].bestScore || 0);

  if (typeof score !== "undefined" && score > best) {
    users[user].bestScore = score;
    saveUsers(users);
  }
}

// ===== LOGIN UI =====
function updateLoginUI() {
  const user = getCurrentUserFromToken();

  if (user) {
    const users = loadUsers();
    const bestScore = users[user]?.bestScore ?? 0;

    loginBox?.classList.add("hidden");
    welcomeBar?.classList.remove("hidden");

    if (welcomeText) {
      welcomeText.textContent = `Welcome, ${user}! 💥Best Score: ${bestScore}💥`;
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
  }
}

// ===== SIGN UP =====
signupBtn?.addEventListener("click", () => {
  const username = usernameEl.value.trim();
  const password = passwordEl.value.trim();
  const pin = pinEl.value.trim();

  if (!username || !password || !pin) {
    loginMsg.textContent = "Enter username, password, and 4-digit PIN.";
    return;
  }

  if (!/^\d{4}$/.test(pin)) {
    loginMsg.textContent = "PIN must be exactly 4 digits.";
    return;
  }

  const users = loadUsers();

  if (users[username]) {
    loginMsg.textContent = "Username already exists.";
    return;
  }

  users[username] = {
    password,
    pin,
    trustedDeviceId: getDeviceId(),
    bestScore: 0
  };

  saveUsers(users);
  loginMsg.textContent = "Account created! Now click LOGIN.";
});

// ===== LOGIN =====
loginBtn?.addEventListener("click", () => {
  const username = usernameEl.value.trim();
  const password = passwordEl.value.trim();
  const pin = pinEl.value.trim();

  if (!username || !password) {
    loginMsg.textContent = "Enter username and password.";
    return;
  }

  const users = loadUsers();

  if (!users[username]) {
    loginMsg.textContent = "User not found. Please SIGN UP first.";
    return;
  }

  if (users[username].password !== password) {
    loginMsg.textContent = "Incorrect password.";
    playSound(wrongSound);
    return;
  }

  const currentDeviceId = getDeviceId();

  if (
    users[username].trustedDeviceId &&
    users[username].trustedDeviceId !== currentDeviceId
  ) {
    if (!pin) {
      loginMsg.textContent = "New device detected. Enter your 4-digit PIN.";
      return;
    }

    if (users[username].pin !== pin) {
      loginMsg.textContent = "Wrong PIN. Access denied.";
      playSound(wrongSound);
      return;
    }

    users[username].trustedDeviceId = currentDeviceId;
    saveUsers(users);
  }

  const token = generateToken();
  const sessions = loadSessions();
  sessions[token] = username;
  saveSessions(sessions);
  setSessionToken(token);

  loginMsg.textContent = "";
  updateLoginUI();

  if (typeof startFreshGame === "function") {
    startFreshGame();
  }
});

// ===== LOGOUT =====
logoutBtn?.addEventListener("click", () => {
  updateBestScore();

  invalidateCurrentSession();

  if (typeof timerId !== "undefined") {
    clearInterval(timerId);
    timerId = null;
  }

  updateLoginUI();
});