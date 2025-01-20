const questions = [
  {
    word: { en: "house", sr: "kuća" },
    options: { en: ["key", "dog", "house"], sr: ["ključ", "pas", "kuća"] },
    correct: 2,
  },
  {
    word: { en: "apple", sr: "jabuka" },
    options: {
      en: ["banana", "apple", "orange"],
      sr: ["banana", "jabuka", "narandža"],
    },
    correct: 1,
  },
  {
    word: { en: "car", sr: "auto" },
    options: { en: ["car", "bike", "bus"], sr: ["auto", "bicikl", "autobus"] },
    correct: 0,
  },
  {
    word: { en: "school", sr: "škola" },
    options: {
      en: ["school", "university", "library"],
      sr: ["škola", "univerzitet", "biblioteka"],
    },
    correct: 0,
  },
  {
    word: { en: "cat", sr: "mačka" },
    options: { en: ["dog", "cat", "rabbit"], sr: ["pas", "mačka", "zec"] },
    correct: 1,
  },
  {
    word: { en: "water", sr: "voda" },
    options: { en: ["milk", "water", "juice"], sr: ["mleko", "voda", "sok"] },
    correct: 1,
  },
  {
    word: { en: "bread", sr: "hleb" },
    options: {
      en: ["cheese", "bread", "butter"],
      sr: ["sir", "hleb", "puter"],
    },
    correct: 1,
  },
  {
    word: { en: "sun", sr: "sunce" },
    options: { en: ["moon", "star", "sun"], sr: ["mesec", "zvezda", "sunce"] },
    correct: 2,
  },
  {
    word: { en: "tree", sr: "drvo" },
    options: { en: ["flower", "grass", "tree"], sr: ["cvet", "trava", "drvo"] },
    correct: 2,
  },
  {
    word: { en: "book", sr: "knjiga" },
    options: {
      en: ["pen", "book", "notebook"],
      sr: ["olovka", "knjiga", "sveska"],
    },
    correct: 1,
  },
  {
    word: { en: "table", sr: "sto" },
    options: {
      en: ["chair", "table", "cupboard"],
      sr: ["stolica", "sto", "ormar"],
    },
    correct: 1,
  },
  {
    word: { en: "dog", sr: "pas" },
    options: { en: ["cat", "dog", "fish"], sr: ["mačka", "pas", "riba"] },
    correct: 1,
  },
  {
    word: { en: "milk", sr: "mleko" },
    options: { en: ["water", "milk", "juice"], sr: ["voda", "mleko", "sok"] },
    correct: 1,
  },
  {
    word: { en: "chair", sr: "stolica" },
    options: { en: ["table", "chair", "sofa"], sr: ["sto", "stolica", "kauč"] },
    correct: 1,
  },
  {
    word: { en: "flower", sr: "cvet" },
    options: { en: ["tree", "grass", "flower"], sr: ["drvo", "trava", "cvet"] },
    correct: 2,
  },
];

let currentQuestion = 0;
let score = 0;
let startTime;
let sessionTimer;
let sessionStarted = false;
const lang = localStorage.getItem("language") || "en";

if (!localStorage.getItem("quizStats")) {
  localStorage.setItem(
    "quizStats",
    JSON.stringify({
      gamesPlayed: 0,
      worstTime: 0,
      bestTime: 0,
      lastSessionDate: null,
    })
  );
}

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const container = document.querySelector(".quiz-container");

function initQuiz() {
  showQuestion(currentQuestion);
  feedbackEl.style.visibility = "hidden";
  startSession();
}

function showQuestion(index) {
  const question = questions[index];
  const currentLang = localStorage.getItem("language") || "en";
  questionEl.textContent =
    currentLang === "en"
      ? `What is the translation of the word "${question.word.sr}"?`
      : `Koji je prevod reči "${question.word.en}"?`;

  optionsEl.innerHTML = "";
  question.options[currentLang].forEach((option, i) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(i));
    optionsEl.appendChild(button);
  });
}

function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestion].correct;
  const buttons = optionsEl.getElementsByClassName("option-btn");

  Array.from(buttons).forEach((button) => {
    button.disabled = true;
  });

  if (selectedIndex === correctIndex) {
    buttons[selectedIndex].classList.add("correct");
    feedbackEl.textContent = lang === "sr" ? "Tačno!" : "Correct!";
    feedbackEl.style.color = "#4CAF50";
    score++;
  } else {
    buttons[selectedIndex].style.backgroundColor = "#dc3545";
    buttons[correctIndex].classList.add("correct");
    feedbackEl.textContent = lang === "sr" ? "Netačno!" : "Incorrect!";
    feedbackEl.style.color = "#dc3545";
  }

  feedbackEl.style.visibility = "visible";
  nextBtn.disabled = false;
}

function endQuiz() {
  optionsEl.innerHTML = "";
  feedbackEl.style.visibility = "hidden";
  questionEl.textContent =
    lang === "sr"
      ? `Kviz završen! Vaš rezultat: ${score}/${questions.length}`
      : `Quiz completed! Your score: ${score}/${questions.length}`;

  nextBtn.textContent = lang === "sr" ? "Ponovi kviz" : "Restart Quiz";
  container.style["justify-content"] = "center";
  endSession();

  nextBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    container.style["justify-content"] = "flex-end";

    nextBtn.textContent = lang === "sr" ? "Sledeće pitanje" : "Next Question";
    initQuiz();
  });
}

function startSession() {
  if (!sessionStarted) {
    sessionStarted = true;
    startTime = Date.now();
    updateTimer();
    sessionTimer = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("session-time").textContent = formatTime(elapsed);
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
    updateQuizStats(sessionDuration);
    sessionStarted = false;
  }
}

function updateQuizStats(sessionDuration) {
  const stats = JSON.parse(localStorage.getItem("quizStats"));
  stats.gamesPlayed++;
  stats.lastSessionDate = new Date().toISOString();
  if (stats.bestTime === 0 || stats.worstTime === 0) {
    stats.bestTime = sessionDuration;
    stats.worstTime = sessionDuration;
  }
  if (sessionDuration > stats.worstTime) stats.worstTime = sessionDuration;
  if (sessionDuration < stats.bestTime) stats.bestTime = sessionDuration;

  localStorage.setItem("quizStats", JSON.stringify(stats));
}

function updateStatsDisplay() {
  document.getElementById("current-progress").textContent = `${
    currentQuestion + 1
  }/${questions.length}`;
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
    nextBtn.disabled = true;
    feedbackEl.style.visibility = "hidden";
    updateStatsDisplay();
  } else {
    endQuiz();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
  updateStatsDisplay();
  const mainHeader = document.querySelector("main-header");
  if (mainHeader && typeof mainHeader.switchLanguage === "function") {
    const originalSwitchLanguage = mainHeader.switchLanguage.bind(mainHeader);

    mainHeader.switchLanguage = (lang) => {
      originalSwitchLanguage(lang);
      initQuiz();
    };
  } else {
    console.error(
      "main-header component not found or switchLanguage method is not defined."
    );
  }
});
