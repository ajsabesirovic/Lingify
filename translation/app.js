const baseUrl = "https://vebdizajn-4.onrender.com/api/vebdizajn/prevod";

const swapMobile = document.querySelector(".mobileSwap");
const swapDesktop = document.querySelector(".desktopSwap");
const inputTextElement = document.getElementById("inputText");
const outputTextElement = document.getElementById("outputText");
const copyButton = document.getElementById("copyButton");
const tooltip = document.getElementById("myTooltip");
let lang = localStorage.getItem("language") || "en";

document.getElementById("clearText").addEventListener("click", clearTextFields);
document
  .getElementById("translateBtn")
  .addEventListener("click", debounce(translateText, 300));

swapMobile.addEventListener("click", swapLangs);
swapDesktop.addEventListener("click", swapLangs);

outputTextElement.addEventListener("input", toggleCopyButton);

inputTextElement.addEventListener("input", () => {
  outputTextElement.value = "";
  toggleCopyButton();
});

function toggleCopyButton() {
  const button = copyButton.querySelector("button");
  button.disabled = !outputTextElement.value.trim();
}

function clearTextFields() {
  inputTextElement.value = "";
  outputTextElement.value = "";
  toggleCopyButton();
}

async function translateText() {
  const inputText = inputTextElement.value.trim().toLowerCase();
  if (outputTextElement.value) {
    return;
  }
  if (!inputText) {
    let msg =
      lang === "en"
        ? "Please enter text to translate."
        : "Unesite tekst za prevod.";
    alert(msg);
    inputTextElement.focus();
    return;
  }

  const { originalLangEn, translatedLangEn } = getLanguagePairEn();
  const { originalLangSr, translatedLangSr } = getLanguagePairSr();

  const originalLang = document
    .querySelector(".originalLang")
    .textContent.trim();

  try {
    let response = await fetch(
      `${baseUrl}?rec=${encodeURIComponent(inputText)}&jezik=${mapLanguage(
        originalLang
      )}`
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    let translatedTextResponse = await response.text();

    if (!translatedTextResponse) {
      const alternativeLang =
        originalLang === "English" || originalLang === "Engleski"
          ? "srpski"
          : "engleski";
      response = await fetch(
        `${baseUrl}?rec=${encodeURIComponent(inputText)}&jezik=${mapLanguage(
          alternativeLang
        )}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      translatedTextResponse = await response.text();

      if (translatedTextResponse) {
        let altLang;
        if (lang == "en") {
          altLang = alternativeLang == "engleski" ? "English" : "Serbian";
        } else {
          altLang = alternativeLang == "engleski" ? "Engleskog" : "Srpskog";
        }
        let msg =
          lang == "en"
            ? `The word seems to be from a different language. Did you mean to translate from ${altLang}?`
            : `Čini se da je reč iz drugog jezika. Da li ste hteli da prevedete sa ${altLang}?`;
        const confirmSwap = confirm(msg);

        if (confirmSwap) {
          swapLangs();
          inputTextElement.value = inputText;
          outputTextElement.value = translatedTextResponse;
          toggleCopyButton();
          saveTranslation(
            inputText,
            translatedTextResponse,
            `${translatedLangEn}-${originalLangEn}`,
            `${translatedLangSr}-${originalLangSr}`
          );
          return;
        }
      }
    }

    if (translatedTextResponse) {
      outputTextElement.value = translatedTextResponse;
      toggleCopyButton();
      saveTranslation(
        inputText,
        translatedTextResponse,
        `${originalLangEn}-${translatedLangEn}`,
        `${originalLangSr}-${translatedLangSr}`
      );
    } else {
      throw new Error(`Couldn't translate word: ${inputText}`);
    }
  } catch (error) {
    let msg =
      lang === "en"
        ? "An error occurred while translating. Please try again."
        : "Došlo je do greške pri prevođenju. Pokušajte ponovo.";
    alert(msg);
  }
}

function swapLangs() {
  document
    .querySelectorAll(".originalLang, .translatedLang")
    .forEach((lang, index, langs) => {
      if (index % 2 === 0) {
        [langs[index].textContent, langs[index + 1].textContent] = [
          langs[index + 1].textContent,
          langs[index].textContent,
        ];

        const tempEn = langs[index].getAttribute("data-lang-en");
        const tempSr = langs[index].getAttribute("data-lang-sr");

        langs[index].setAttribute(
          "data-lang-en",
          langs[index + 1].getAttribute("data-lang-en")
        );
        langs[index].setAttribute(
          "data-lang-sr",
          langs[index + 1].getAttribute("data-lang-sr")
        );

        langs[index + 1].setAttribute("data-lang-en", tempEn);
        langs[index + 1].setAttribute("data-lang-sr", tempSr);
      }
    });

  clearTextFields();
}

function getLanguagePairEn() {
  const originalLang = document
    .querySelector(".originalLang")
    .getAttribute("data-lang-en");
  const translatedLang = document
    .querySelector(".translatedLang")
    .getAttribute("data-lang-en");

  return { originalLangEn: originalLang, translatedLangEn: translatedLang };
}

function getLanguagePairSr() {
  const originalLang = document
    .querySelector(".originalLang")
    .getAttribute("data-lang-sr");
  const translatedLang = document
    .querySelector(".translatedLang")
    .getAttribute("data-lang-sr");

  return { originalLangSr: originalLang, translatedLangSr: translatedLang };
}
function mapLanguage(lang) {
  return lang.toLowerCase() === "english" || lang.toLowerCase() === "engleski"
    ? "engleski"
    : "srpski";
}
function myFunction() {
  const translatedText = outputTextElement.value;
  navigator.clipboard.writeText(translatedText).then(() => {
    tooltip.innerHTML = `Copied: ${translatedText}`;
  });
}

function outFunc() {
  tooltip.innerHTML = "Copy to clipboard";
}

function saveTranslation(
  inputText,
  translatedText,
  languagePairEn,
  languagePairSr
) {
  try {
    const translationHistory = JSON.parse(
      localStorage.getItem("translationHistory") || "[]"
    );
    translationHistory.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      original: inputText,
      translation: translatedText,
      languagePairEn,
      languagePairSr,
      starred: false,
    });
    localStorage.setItem(
      "translationHistory",
      JSON.stringify(translationHistory)
    );
  } catch (error) {
    let msg =
      lang === "en"
        ? "An error occurred while saving the translation history."
        : "Došlo je do greške pri čuvanju istorije prevoda.";
    alert(msg);
  }
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
toggleCopyButton();

document.addEventListener("DOMContentLoaded", () => {
  const mainHeader = document.querySelector("main-header");
  if (mainHeader && typeof mainHeader.switchLanguage === "function") {
    const originalSwitchLanguage = mainHeader.switchLanguage.bind(mainHeader);

    mainHeader.switchLanguage = (language) => {
      originalSwitchLanguage(language);
      lang = language;
    };
  } else {
    console.error(
      "main-header component not found or switchLanguage method is not defined."
    );
  }
});
