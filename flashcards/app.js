const words = [
  { word: "house", translation: "kuća" },
  { word: "cat", translation: "mačka" },
  { word: "sun", translation: "sunce" },
  { word: "water", translation: "voda" },
  { word: "friend", translation: "prijatelj" },
  { word: "tree", translation: "drvo" },
  { word: "book", translation: "knjiga" },
  { word: "car", translation: "auto" },
  { word: "flower", translation: "cvet" },
  { word: "bird", translation: "ptica" },
  { word: "apple", translation: "jabuka" },
  { word: "bread", translation: "hleb" },
  { word: "mountain", translation: "planina" },
  { word: "river", translation: "reka" },
  { word: "window", translation: "prozor" },
];

let currentCard = 0;
let startTime;
let lastCardTime;
let sessionTimer;
let cardsReviewed = 0;
let sessionStarted = false;
const session = document.getElementById("session-time");
const lang = localStorage.getItem("language") || "en";
if (!localStorage.getItem("flashcardStats")) {
  localStorage.setItem(
    "flashcardStats",
    JSON.stringify({
      gamesPlayed: 0,
      bestTime: 0,
      worstTime: 0,
      lastSessionDate: null,
    })
  );
}
const totalTime = JSON.parse(
  localStorage.getItem("flashcardStats")
).totalTimeSpent;

function startSession() {
  if (!sessionStarted) {
    sessionStarted = true;
    startTime = Date.now();
    lastCardTime = startTime;

    updateTimer();
    sessionTimer = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  const currentTime = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("session-time").textContent = formatTime(currentTime);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function endSession() {
  if (sessionStarted) {
    clearInterval(sessionTimer);
    const sessionDuration = Math.floor((Date.now() - startTime) / 1000);
    updateFlashcardStats(sessionDuration);
    sessionStarted = false;
  }
}

function updateFlashcardStats(sessionDuration) {
  const stats = JSON.parse(localStorage.getItem("flashcardStats"));
  stats.lastSessionDate = new Date().toISOString();
  stats.gamesPlayed++;
  if (stats.bestTime === 0 || stats.worstTime === 0) {
    stats.bestTime = sessionDuration;
    stats.worstTime = sessionDuration;
  }
  if (sessionDuration > stats.worstTime) stats.worstTime = sessionDuration;
  if (sessionDuration < stats.bestTime) stats.bestTime = sessionDuration;

  localStorage.setItem("flashcardStats", JSON.stringify(stats));
  updateStatsDisplay();
}

function updateStatsDisplay() {
  document.getElementById("current-progress").textContent = `${
    currentCard + 1
  }/${words.length}`;
}

function showFlashcard() {
  document.getElementById("word").textContent = words[currentCard].word;
  document.getElementById("translation").textContent = "";
  updateStatsDisplay();
}

function revealTranslation() {
  startSession();
  const translationElement = document.getElementById("translation");
  translationElement.textContent = words[currentCard].translation;
  translationElement.classList.add("visible");
}

function nextFlashcard() {
  if (!sessionStarted) return;

  const currentTime = Date.now();
  lastCardTime = currentTime;

  const translationElement = document.getElementById("translation");
  translationElement.classList.remove("visible");

  cardsReviewed++;
  currentCard = (currentCard + 1) % words.length;

  if (currentCard === 0) {
    endSession();
    let msg =
      lang === "en"
        ? "Congratulations! You've completed a full round!"
        : "Čestitamo! Završili ste rundu!";
    alert(msg);
    cardsReviewed = 0;
    session.textContent = "0:00";
  }

  showFlashcard();
  updateStatsDisplay();
}

showFlashcard();
updateStatsDisplay();
