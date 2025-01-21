class Header extends HTMLElement {
  constructor() {
    super();
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.lang = localStorage.getItem("language") || "en";
    this.paths = [];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.initializeLanguage();
    this.switchLanguage(this.lang);
    this.updateNavigation();
  }

  render() {
    this.innerHTML = `<header>
  <div class="cont">
  <div class="logo">
  <a href="../facts/index.html">
  <img src="../assets/logo.png" width="70px" height="70px" alt="Logo" />
  </a>
  </div>
  <nav>
  <a
  href="../translation/index.html"
  class="nav-item links"
  id="lang-link"
  data-path="translation"
  data-lang-en="Translator"
  data-lang-sr="Prevodilac"
  >
  Translator </a>

  <a
  href="../history/index.html"
  class="nav-item links"
  id="history-link"
  data-path="history"
  data-lang-en="History"
  data-lang-sr="Istorija"
  >
  History
  </a>
  <a
  href="../contact/index.html"
  class="nav-item links"
  id="contact-link"
  data-path="contact"
  data-lang-en="Contact"
  data-lang-sr="Kontakt"
  >
  Contact
  </a>
  <a
  href="../progress/index.html"
  class="nav-item links"
  id="progress-link"
  data-path="progress"
  data-lang-en="Progress"
  data-lang-sr="Progres"
  >
  Progress
  </a>
  <div class="dropdown" id="games-dropdown">
  <button class="dropdown-button">
  <span class="current-game" data-lang-en="Games" data-lang-sr="Igre">
  Games
  </span>
  <svg
  class="dropdown-arrow"
  width="12"
  height="12"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  >
  <path d="M6 9l6 6 6-6" />
  </svg>
  </button>
  <div class="dropdown-content">
  <a
  class="game-links"
  href="../matching_words/index.html"
  data-lang-en="Matching words"
  data-lang-sr="Povezivanje reči"
  data-path="matching_words"
  >

  Matching words
  </a>
  <a
  class="game-links"
  href="../flashcards/index.html"
  data-lang-en="Flashcards"
  data-lang-sr="Kartice"
  data-game="Flashcards"
  data-path="flashcards"
  >
  Flashcards
  </a>
  <a 
  class="game-links"
  href="../quiz/index.html" 
  data-lang-en="Quiz" 
  data-lang-sr="Kviz" 
  data-path="quiz"
  
  >
  Quiz
  </a>
  </div>
  </div>
  </nav>
  </div>
  <div class="lang-user">
  <div class="language-switcher"">
  <img
  src="https://flagcdn.com/w20/gb.png"
  width="20"
  height="15"
  alt="English"
  id="flag-en"
  />
  <img
  src="https://flagcdn.com/w20/rs.png"
  width="20"
  height="15"
  alt="Serbian"
  id="flag-sr"
  style="display: none"
  />
  <span id="ln-sw">en</span>
  </div>
  <div class="user-icon dropdown" id="user-icon" >
  <span>${localStorage.getItem("userInitials")}</span>
  <div class="dropdown-content" style="min-width: 100px; left: -50px" >
  <a
  href="#"
  id="logout"
  data-lang-en="Logout"
  data-lang-sr="Odjava"
  >
  Logout
  </a>

  </div>
  </div>
  </div>
  </header>
  `;
  }

  setupEventListeners() {
    const header = document.querySelector("header");

    const languageSwitcher = this.querySelector(".language-switcher");
    const ln = this.querySelector("#ln-sw");
    const flagEn = this.querySelector("#flag-en");
    const flagSr = this.querySelector("#flag-sr");
    const gamesDropdown = this.querySelector("#games-dropdown");
    const dropdownButton = gamesDropdown.querySelector(".dropdown-button");
    const gameLinks = gamesDropdown.querySelectorAll(".dropdown-content a");
    const links = this.querySelectorAll(".links");
    const logo = this.querySelector(".logo");
    const logoutButton = this.querySelector("#logout");
    const userIcon = this.querySelector(".user-icon");

    languageSwitcher.addEventListener("click", () => {
      const newLang = ln.textContent === "en" ? "sr" : "en";
      ln.textContent = newLang;
      flagEn.style.display = newLang === "en" ? "inline" : "none";
      flagSr.style.display = newLang === "sr" ? "inline" : "none";
      localStorage.setItem("language", newLang);
      this.switchLanguage(newLang);
      this.updateActiveLink();
    });

    logo.addEventListener("click", () => {
      this.updateActiveLink();
    });

    dropdownButton.addEventListener("click", (e) => {
      e.stopPropagation();
      gamesDropdown.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!gamesDropdown.contains(e.target)) {
        gamesDropdown.classList.remove("active");
      }
    });
    document.addEventListener("click", (e) => {
      if (!userIcon.contains(e.target)) {
        userIcon.querySelector(".dropdown-content").style.display = "none";
      }
    });

    header.addEventListener("click", (e) => {
      if (!userIcon.contains(e.target)) {
        userIcon.querySelector(".dropdown-content").style.display = "none";
      }
    });

    userIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdownContent = userIcon.querySelector(".dropdown-content");
      dropdownContent.style.display =
        dropdownContent.style.display === "flex" ? "none" : "flex";
    });
    gameLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const selectedGame =
          this.lang === "en"
            ? e.target.getAttribute("data-lang-en")
            : e.target.getAttribute("data-lang-sr");
        this.querySelector(".current-game").textContent = selectedGame;
        localStorage.setItem("gameEn", e.target.getAttribute("data-lang-en"));
        localStorage.setItem("gameSr", e.target.getAttribute("data-lang-sr"));

        gamesDropdown.classList.remove("active");
        this.updateActiveLink();
      });
    });

    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        this.updateActiveLink();
      });
    });

    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.logout();
    });
  }
  updateActiveLink() {
    const currGame = this.querySelector(".current-game");
    const path = window.location?.pathname;
    const paths = path.split("/");
    this.paths = paths;
    let isGamePage = false;
    this.querySelectorAll(".links, .current-game").forEach((link) => {
      link.classList.remove("active_link");
    });

    this.querySelectorAll(".game-links").forEach((link) => {
      if (paths.includes(link.dataset.path)) {
        isGamePage = true;

        const gameData = {
          en: link.getAttribute("data-lang-en"),
          sr: link.getAttribute("data-lang-sr"),
          path: link.dataset.path,
        };
        localStorage.setItem("currentGame", JSON.stringify(gameData));

        currGame.textContent = this.lang === "en" ? gameData.en : gameData.sr;
        this.querySelector(".dropdown-button").classList.add("active_link");
      }
    });

    if (!isGamePage) {
      this.querySelectorAll(".links").forEach((link) => {
        if (paths.includes(link.dataset.path)) {
          link.classList.add("active_link");
          currGame.textContent = this.lang === "en" ? "Games" : "Igre";
          localStorage.removeItem("currentGame");
        }
      });
    }
  }

  switchLanguage(lang) {
    this.lang = lang;

    document.querySelectorAll("[data-lang-en]").forEach((el) => {
      const newText = el.getAttribute(`data-lang-${lang}`);
      if (el.placeholder) {
        el.placeholder = newText;
      } else if (!el.classList.contains("current-game")) {
        el.textContent = newText;
      }
    });

    const currGame = this.querySelector(".current-game");
    const storedGame = localStorage.getItem("currentGame");

    if (storedGame) {
      const gameData = JSON.parse(storedGame);
      currGame.textContent = lang === "en" ? gameData.en : gameData.sr;
    } else {
      currGame.textContent = lang === "en" ? "Games" : "Igre";
    }
  }

  initializeLanguage() {
    const ln = this.querySelector("#ln-sw");
    const flagEn = this.querySelector("#flag-en");
    const flagSr = this.querySelector("#flag-sr");

    ln.textContent = this.lang;
    flagEn.style.display = this.lang === "en" ? "inline" : "none";
    flagSr.style.display = this.lang === "sr" ? "inline" : "none";
  }

  document;
  updateNavigation() {
    const navItems = [
      "#progress-link",
      "#lang-link",
      "#contact-link",
      "#history-link",
      "#games-dropdown",
      "#user-icon",
    ];
    const logoLink = document.querySelector(".logo a");

    navItems.forEach((selector) => {
      const element = this.querySelector(selector);
      if (element) {
        element.style.display = this.isLoggedIn ? "flex" : "none";
      }
    });

    if (!this.isLoggedIn && logoLink) {
      logoLink.href = "#";
      logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        let msg =
          this.lang === "en"
            ? "Please log in to access the homepage."
            : "Molimo Vas, ulogujte se kako bi pristupili home stranici.";
        alert(msg);
      });
    }
    this.updateActiveLink();

    if (!this.isLoggedIn) {
      if (!this.paths.includes("landing") && !this.paths.includes("login")) {
        window.location.href = "../landing/index.html";
      }
    } else {
      if (this.paths.includes("landing") || this.paths.includes("login")) {
        window.location.href = "../facts/index.html";
      }
    }
  }

  logout() {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userInitials");
    localStorage.removeItem("gameEn");
    localStorage.removeItem("gameSr");
    localStorage.removeItem("selectedItem");
    localStorage.removeItem("currentGame");
    localStorage.removeItem("quizStats");
    localStorage.removeItem("flashcardStats");
    localStorage.removeItem("wordMatchStats");
    this.isLoggedIn = false;
    this.updateNavigation();
    window.location.href = "../login/index.html";
  }
}

class Footer extends HTMLElement {
  constructor() {
    super();
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.lang = localStorage.getItem("language") || "en";
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.switchLanguage(this.lang);

    this.updateNavigation();
  }

  render() {
    this.innerHTML = `
  <div class="main_footer">
  <p data-lang-en="Designed and Built by Ajša Beširović." data-lang-sr="Dizajnirala i izradila Ajša Beširović."> Designed and Built by Ajsa Besirovic.</p>
  <p data-lang-en="All rights reserved ©2025" data-lang-sr="Sva prava zadržana ©2025">All rights reserved ©2025</p>
  </div>
  <div class="main_footer-mobile">
  <nav>
  <a href="../contact/index.html"><img src="../assets/conversation.png" alt="msgs" /></a>
  <a href="../history/index.html"><img style="margin-right: 40px" src="../assets/history.png" alt="word" /></a>
  <div class="bg-elipse"></div>
  <div class="elipse">
  <a style="height: 40px" href="../translation/index.html"><img src="../assets/language.png" alt="lang" /></a>
  </div>
  <a id="popupTrigger"><img style="margin-left: 40px" src="../assets/word.png" alt="hist" /></a>
  <div class="user-icon dropdown" id="footer-user-icon">
  <span id="AB">${localStorage.getItem("userInitials")}</span>
  <div class="dropdown-content" id="footer-dropdown-content">
  <button class="close-popup-l">&times;</button>
  <a href="#" id="footer-logout" data-lang-en="Logout" data-lang-sr="Odjava">Logout</a>
  </div>
  </div>
  
  </nav>
  </div>
  
  <div class="popup-overlay" style="display: none;">
  <div class="popup">
  <button class="close-popup">&times;</button>
  <div class="popup-content">
  <a class="progres" href="../progress/index.html" data-lang-en="Check out your progress." data-lang-sr="Proverite svoj napredak.">Check out your progress.</a>
  <a href="../matching_words/index.html" data-lang-en="Matching Words" data-lang-sr="Povezivanje reči">Matching Words</a>
  <a href="../flashcards/index.html" data-lang-en="Flashcards" data-lang-sr="Kartice">Flashcards</a>
  <a href="../quiz/index.html" data-lang-en="Quiz" data-lang-sr="Kviz">Quiz</a>
  </div>
  </div>
  </div>
  `;
  }

  setupEventListeners() {
    const popupTrigger = this.querySelector("#popupTrigger");
    const popupOverlay = this.querySelector(".popup-overlay");
    const popup = this.querySelector(".popup");
    const closeButton = this.querySelector(".close-popup");
    const logoutButton = this.querySelector("#footer-logout");
    const userIcon = this.querySelector("#footer-user-icon");
    const dropdownContent = this.querySelector("#footer-dropdown-content");

    popupTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      this.showPopup(popupOverlay, popup);
    });

    closeButton.addEventListener("click", () =>
      this.hidePopup(popupOverlay, popup)
    );

    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        this.hidePopup(popupOverlay, popup);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && popupOverlay.style.display === "flex") {
        this.hidePopup(popupOverlay, popup);
      }
    });

    userIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = dropdownContent.style.display === "flex";
      dropdownContent.style.display = isVisible ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      }
    });

    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.logout();
    });
  }

  showPopup(popupOverlay, popup) {
    popupOverlay.style.display = "flex";
    setTimeout(() => popup.classList.add("active"), 10);
  }

  hidePopup(popupOverlay) {
    popupOverlay.classList.add("hidden");
    setTimeout(() => {
      popupOverlay.style.display = "none";
      popupOverlay.classList.remove("hidden");
    }, 300);
  }

  switchLanguage(lang) {
    this.lang = lang;
    const changeText = (el) => {
      el.placeholder
        ? (el.placeholder = el.getAttribute(`data-lang-${lang}`))
        : (el.textContent = el.getAttribute(`data-lang-${lang}`));
    };
    const dropdown1 = document.querySelector("#footer-dropdown-content");
    const dropdown2 = document.querySelector(".popup-overlay");
    dropdown1
      .querySelectorAll("[data-lang-en]")
      .forEach((el) => changeText(el));
    dropdown2
      .querySelectorAll("[data-lang-en]")
      .forEach((el) => changeText(el));
  }
  logout() {
    const dropdownContent = this.querySelector("#footer-dropdown-content");
    if (dropdownContent) {
      dropdownContent.style.display = "none";
    }

    localStorage.setItem("isLoggedIn", "false");
    this.isLoggedIn = false;

    window.location.href = "../login/index.html";
  }

  updateNavigation() {
    const navItems = ["#footer-user-icon", "#popupTrigger"];
    navItems.forEach((selector) => {
      const element = this.querySelector(selector);
      if (element) {
        element.style.display = this.isLoggedIn ? "flex" : "none";
      }
    });

    const dropdownContent = this.querySelector("#footer-dropdown-content");
    if (dropdownContent) {
      dropdownContent.style.display = "none";
    }
  }
}

customElements.define("main-header", Header);
customElements.define("main-footer", Footer);
