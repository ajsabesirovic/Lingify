function formatTime(seconds) {
  if (!seconds) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDate(date) {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  return date.toLocaleString("sr-RS", options).replace(",", "");
}

function updateStatElement(elementId, value, formatter) {
  const element = document.getElementById(elementId);
  const currentLanguage = document.documentElement.lang || "en";

  if (value === null || value === undefined) {
    element.setAttribute("data-lang-en", "Never");
    element.setAttribute("data-lang-sr", "Nikada");
    element.textContent = currentLanguage === "en" ? "Never" : "Nikada";
  } else if (formatter) {
    const formattedValue = formatter(value);
    element.setAttribute("data-lang-en", formattedValue);
    element.setAttribute("data-lang-sr", formattedValue);
    element.textContent = formattedValue;
  } else {
    element.setAttribute("data-lang-en", value);
    element.setAttribute("data-lang-sr", value);
    element.textContent = value;
  }
}

function updateProgressDisplay() {
  const wordMatchStats = JSON.parse(localStorage.getItem("wordMatchStats")) || {
    gamesPlayed: 0,
    bestTime: null,
    worstTime: null,
    lastSessionDate: null,
  };
  const flashcardStats = JSON.parse(localStorage.getItem("flashcardStats")) || {
    gamesPlayed: 0,
    bestTime: 0,
    worstTime: 0,
    lastSessionDate: null,
  };
  const quizStats = JSON.parse(localStorage.getItem("quizStats")) || {
    gamesPlayed: 0,
    bestTime: null,
    worstTime: null,
    lastSessionDate: null,
  };
  updateStatElement("games-played", wordMatchStats.gamesPlayed);
  updateStatElement("best-time", wordMatchStats.bestTime || 0, formatTime);
  updateStatElement("worst-time", wordMatchStats.worstTime || 0, formatTime);

  updateStatElement(
    "last-played",
    wordMatchStats.lastSessionDate
      ? new Date(wordMatchStats.lastSessionDate)
      : null,
    formatDate
  );

  updateStatElement("cards-games-played", flashcardStats.gamesPlayed);
  updateStatElement(
    "flash-best-time",
    flashcardStats.bestTime || 0,
    formatTime
  );
  updateStatElement(
    "flash-worst-time",
    flashcardStats.worstTime || 0,
    formatTime
  );
  updateStatElement(
    "last-session",
    flashcardStats.lastSessionDate
      ? new Date(flashcardStats.lastSessionDate)
      : null,
    formatDate
  );

  updateStatElement("quiz-games-played", quizStats.gamesPlayed);
  updateStatElement("quiz-best-time", quizStats.bestTime || 0, formatTime);
  updateStatElement("quiz-worst-time", quizStats.worstTime || 0, formatTime);
  updateStatElement(
    "quiz-last-played",
    quizStats.lastSessionDate ? new Date(quizStats.lastSessionDate) : null,
    formatDate
  );
}

document.addEventListener("DOMContentLoaded", () => {
  updateProgressDisplay();

  const mainHeader = document.querySelector("main-header");

  if (mainHeader && typeof mainHeader.switchLanguage === "function") {
    const originalSwitchLanguage = mainHeader.switchLanguage.bind(mainHeader);

    mainHeader.switchLanguage = (lang) => {
      originalSwitchLanguage(lang);
      updateProgressDisplay();
    };
  } else {
    console.error(
      "main-header component not found or switchLanguage method is not defined."
    );
  }
});
