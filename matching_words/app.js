const words = [
  { english: "house", foreign: "kuca" },
  { english: "cat", foreign: "macka" },
  { english: "dog", foreign: "pas" },
  { english: "book", foreign: "knjiga" },
  { english: "tree", foreign: "drvo" },
  { english: "water", foreign: "voda" },
];

let selectedCards = [];
let matchedPairs = 0;
let canFlip = true;
let startTime;
let gameTimer;
let timerDisplay;

if (!localStorage.getItem("wordMatchStats")) {
  localStorage.setItem(
    "wordMatchStats",
    JSON.stringify({
      gamesPlayed: 0,
      bestTime: null,
      worstTime: null,
      lastSessionDate: null,
    })
  );
}
const lang = localStorage.getItem("language") || "en";

function startTimer() {
  startTime = Date.now();
  timerDisplay = document.getElementById("session-time");
  gameTimer = setInterval(() => {
    if (startTime) {
      const currentTime = Math.floor((Date.now() - startTime) / 1000);
      timerDisplay.textContent = formatTime(currentTime);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(gameTimer);
  gameTimer = null;
  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);
  updateGameStats(totalTime);
  return totalTime;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateGameStats(totalTime) {
  const stats = JSON.parse(localStorage.getItem("wordMatchStats"));
  stats.gamesPlayed++;
  stats.lastSessionDate = new Date().toISOString();

  if (!stats.bestTime || totalTime < stats.bestTime) {
    stats.bestTime = totalTime;
  }
  if (!stats.worstTime || totalTime > stats.worstTime) {
    stats.worstTime = totalTime;
  }

  localStorage.setItem("wordMatchStats", JSON.stringify(stats));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createGameCards() {
  let cards = [];
  words.forEach((word) => {
    cards.push({ text: word.english, pair: word.foreign });
    cards.push({ text: word.foreign, pair: word.english });
  });
  return shuffleArray(cards);
}

function createCard(cardData, index) {
  const card = document.createElement("div");
  card.className = "card";

  const cardFront = document.createElement("div");
  cardFront.className = "card-front";

  const cardBack = document.createElement("div");
  cardBack.className = "card-back";
  cardBack.textContent = cardData.text;

  card.appendChild(cardFront);
  card.appendChild(cardBack);

  card.dataset.index = index;
  card.dataset.pair = cardData.pair;

  card.addEventListener("click", () => handleCardClick(card));
  return card;
}

function handleCardClick(card) {
  if (
    !canFlip ||
    card.classList.contains("matched") ||
    card.classList.contains("flipped") ||
    selectedCards.length >= 2
  )
    return;

  if (!gameTimer) {
    startTimer();
  }

  card.classList.add("flipped");
  selectedCards.push(card);

  if (selectedCards.length === 2) {
    canFlip = false;
    setTimeout(checkMatch, 1000);
  }
}

function checkMatch() {
  const [card1, card2] = selectedCards;
  const match =
    card1.dataset.pair === card2.querySelector(".card-back").textContent &&
    card2.dataset.pair === card1.querySelector(".card-back").textContent;

  if (match) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedPairs++;

    document.getElementById("scr").textContent = matchedPairs;

    if (matchedPairs === words.length) {
      const totalTime = stopTimer();
      const timeString = formatTime(totalTime);
      setTimeout(() => {
        let msg =
          lang === "en"
            ? `Congratulations! You won in ${timeString}!`
            : "Čestitamo! Pobedili ste!";
        alert(msg);
        resetGame();
      }, 300);
    }
  } else {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
  }

  selectedCards = [];
  canFlip = true;
}

function resetGame() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  startTime = null;

  timerDisplay = document.getElementById("session-time");
  timerDisplay.textContent = "0:00";

  selectedCards = [];
  matchedPairs = 0;
  canFlip = true;

  document.getElementById("scr").textContent = "0";

  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  const cards = createGameCards();
  cards.forEach((card, index) => {
    gameBoard.appendChild(createCard(card, index));
  });
}

function initializeGame() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  matchedPairs = 0;
  document.getElementById("scr").textContent = "0";

  const cards = createGameCards();
  cards.forEach((card, index) => {
    gameBoard.appendChild(createCard(card, index));
  });
}

initializeGame();
