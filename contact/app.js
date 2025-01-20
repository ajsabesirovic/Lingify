const form = document.getElementById("contactForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const message = document.getElementById("message");

const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const messageError = document.getElementById("messageError");

email.value = localStorage.getItem("userEmail") || "";

email.style.color = "var(--primary-color)";
const nameRegex = /^[A-Z | a-z]{3,}$/;
let isValid = true;

function validateForm(lang = localStorage.getItem("language")) {
  let isValid = true;

  firstName.classList.remove("error");
  lastName.classList.remove("error");
  message.classList.remove("error");

  firstNameError.textContent = "";
  lastNameError.textContent = "";
  messageError.textContent = "";

  if (!nameRegex.test(firstName.value)) {
    firstName.classList.add("error");
    firstNameError.textContent =
      lang === "en"
        ? "First Name: min 3 characters, only letters."
        : "Ime: min 3 karaktera, samo slova.";
    isValid = false;
  }

  if (!nameRegex.test(lastName.value)) {
    lastName.classList.add("error");
    lastNameError.textContent =
      lang === "en"
        ? "Last Name: min 3 characters, only letters."
        : "Prezime: min 3 karaktera, samo slova.";

    isValid = false;
  }

  if (message.value.trim().length < 10) {
    message.classList.add("error");
    messageError.textContent =
      lang === "en"
        ? "Message: min 10 characters long."
        : "Poruka: min 10 karaktera.";

    isValid = false;
  }

  return isValid;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validateForm()) {
    form.reset();
    window.location.href = "../success/index.html";
  }
});

[firstName, lastName, message].forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
    const errorElement = document.getElementById(`${input.id}Error`);
    if (errorElement) {
      errorElement.textContent = "";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const mainHeader = document.querySelector("main-header");

  if (mainHeader && typeof mainHeader.switchLanguage === "function") {
    const originalSwitchLanguage = mainHeader.switchLanguage.bind(mainHeader);

    mainHeader.switchLanguage = (lang) => {
      originalSwitchLanguage(lang);
      if (
        firstNameError.textContent ||
        lastNameError.textContent ||
        messageError.textContent
      ) {
        validateForm(lang);
      }
    };
  } else {
    console.error(
      "main-header component not found or switchLanguage method is not defined."
    );
  }
});
