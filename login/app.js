document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("signInForm");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.querySelector(".show-password");
  const img = passwordToggle.querySelector("img");

  let users = [];

  try {
    const response = await fetch("./users.json");
    users = await response.json();
  } catch (error) {
    console.error("Error loading users:", error);
  }

  passwordToggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (passwordInput.value) {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      img.src = isPassword
        ? "../assets/padlock-unlock.png"
        : "../assets/secured-lock.png";
    } else {
      alert("You have to type in the password to be able to see it.");
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = passwordInput.value.trim();

    const hashedPassword = await hashPassword(password);

    const user = users.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.password === hashedPassword
    );

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userInitials", user.initials);
      localStorage.setItem("userEmail", user.email);
      window.location.href = "../facts/index.html";
    } else {
      localStorage.setItem("isLoggedIn", "false");
      alert("Invalid username or password. Please try again.");
    }
  });

  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
});
