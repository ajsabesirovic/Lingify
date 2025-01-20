let translations = localStorage.getItem("translationHistory")
  ? JSON.parse(localStorage.getItem("translationHistory"))
  : [];
let currentPage = 1;
let rowsPerPage = window.innerWidth > 768 ? 10 : translations.length;
let lang = localStorage.getItem("language") || "en";

function updateRowsPerPageVisibility() {
  const rowsPerPageElement = document.getElementById("rowsPerPage");
  if (window.innerWidth <= 768) {
    rowsPerPageElement.style.display = "none";
    rowsPerPage = translations.length;
  } else {
    rowsPerPageElement.style.display = "block";
    rowsPerPage = 10;
  }
  rowsPerPageElement.value = rowsPerPage;
  currentPage = 1;
  renderTable();
}

window.addEventListener("resize", () => {
  updateRowsPerPageVisibility();
});

function toggleEmptyState() {
  const emptyState = document.querySelector(".container-no-data");
  const mainContainer = document.querySelector(".container");

  if (translations.length === 0) {
    emptyState.style.display = "flex";
    mainContainer.style.display = "none";
  } else {
    emptyState.style.display = "none";
    mainContainer.style.display = "block";
  }
}
function getFilteredData() {
  const searchTerm = document.getElementById("search").value?.toLowerCase();
  const favoriteFilter = document.getElementById("favoriteFilter").checked;
  const langPairFilter = document.getElementById("langPairFilter").value;
  const dateFilter = document.getElementById("dateFilter").value;

  return translations.filter((item) => {
    const matchesSearch =
      item.original?.toLowerCase().includes(searchTerm) ||
      item.translation?.toLowerCase().includes(searchTerm) ||
      item.languagePair?.toLowerCase().includes(searchTerm);

    const matchesFavorite = !favoriteFilter || item.starred;

    const langPair = item.languagePairEn === langPairFilter;

    const matchesLangPair = !langPairFilter || langPair;

    const itemDate = new Date(item.date);
    const today = new Date();
    let matchesDate = true;

    if (dateFilter === "today") {
      matchesDate = itemDate.toDateString() === today.toDateString();
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today.setDate(today.getDate() - 7));
      matchesDate = itemDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
      matchesDate = itemDate >= monthAgo;
    }

    return matchesSearch && matchesFavorite && matchesLangPair && matchesDate;
  });
}
function toggleStar(button) {
  const translation = translations.find(
    (item) => item.id === +button.dataset.id
  );

  translation.starred = !translation.starred;
  button.style.color = translation.starred ? "#ffce51" : "#777";
  button.textContent = translation.starred ? "★" : "☆";

  translations = translations.map((item) =>
    item.id === translation.id ? translation : item
  );
  localStorage.setItem("translationHistory", JSON.stringify(translations));
}
function formatDate(date) {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleString("sr-RS", options).replace(",", "");
}
function renderTable() {
  const tableBody = document.getElementById("translationTableBody");
  const filteredData = getFilteredData();

  if (window.innerWidth <= 768) {
    rowsPerPage = filteredData.length;
  }

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  tableBody.innerHTML = "";

  paginatedData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="checkbox-column">
        <input type="checkbox" class="row-checkbox" data-id="${
          item.id
        }" onchange="updateDeleteButton()">
      </td>
      <td>${formatDate(new Date(item.date))}</td>
      <td>${item.original}</td>
      <td>${item.translation}</td>
      <td>${lang === "en" ? item.languagePairEn : item.languagePairSr}</td>
      <td class="actions">
        <button class="star" data-id="${item.id}"
         onclick="toggleStar(this)"
         style="color: ${item.starred ? "#ffce51" : "#777"}">${
      item.starred ? "★" : "☆"
    }</button>
        <button id="clearHistory" data-id="${
          item.id
        }" onclick="deleteTranslation(this)">
          <img src="../assets/delete.png" width="16" height="16" alt="Delete" />
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  document.getElementById("currentPage").textContent = currentPage;
  document.getElementById("firstPage").disabled = currentPage === 1;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
  document.getElementById("lastPage").disabled = currentPage === totalPages;

  toggleEmptyState();
}
function updateDeleteButton() {
  const checkedBoxes = document.querySelectorAll(".row-checkbox:checked");
  const deleteAllBtn = document.getElementById("deleteAllBtn");
  const selectAll = document.querySelector(".selectBtn");
  deleteAllBtn.style.display =
    checkedBoxes.length > 0 ? "inline-block" : "none";
  selectAll.style.display = checkedBoxes.length > 0 ? "flex" : "none";
}
function deleteSelected() {
  const checkedBoxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkedBoxes.length === 0) return;
  if (
    confirm(
      `Are you sure you want to delete ${checkedBoxes.length} selected items?`
    )
  ) {
    const selectedIds = Array.from(checkedBoxes).map((box) => +box.dataset.id);
    translations = translations.filter(
      (item) => !selectedIds.includes(item.id)
    );
    localStorage.setItem("translationHistory", JSON.stringify(translations));
    currentPage = 1;
    renderTable();
    updateDeleteButton();
    const selectAllCheckbox = document.getElementById("all");
    selectAllCheckbox.checked = false;
  }
}
function deleteTranslation(button) {
  if (confirm("Are you sure you want to delete this translation?")) {
    translations = translations.filter(
      (item) => item.id !== +button.dataset.id
    );
    localStorage.setItem("translationHistory", JSON.stringify(translations));
    renderTable();
  }
}
function selectAll() {
  const selectAllCheckbox = document.getElementById("all");
  const rowCheckboxes = document.querySelectorAll(".row-checkbox");

  rowCheckboxes.forEach((checkbox) => {
    checkbox.checked = selectAllCheckbox.checked;
  });
}

function startTranslating() {
  window.location.href = "../translation/index.html";
}

document.getElementById("search").addEventListener("input", () => {
  currentPage = 1;
  renderTable();
});

document.getElementById("favoriteFilter").addEventListener("change", () => {
  currentPage = 1;
  renderTable();
});

document.getElementById("langPairFilter").addEventListener("change", () => {
  currentPage = 1;
  renderTable();
});

document.getElementById("dateFilter").addEventListener("change", () => {
  currentPage = 1;
  renderTable();
});

document.getElementById("rowsPerPage").addEventListener("change", (e) => {
  rowsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderTable();
});

document.getElementById("firstPage").addEventListener("click", () => {
  currentPage = 1;
  renderTable();
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

document.getElementById("lastPage").addEventListener("click", () => {
  currentPage = Math.ceil(getFilteredData().length / rowsPerPage);
  renderTable();
});

document.addEventListener("DOMContentLoaded", () => {
  updateRowsPerPageVisibility();
  renderTable();
  const mainHeader = document.querySelector("main-header");
  if (mainHeader && typeof mainHeader.switchLanguage === "function") {
    const originalSwitchLanguage = mainHeader.switchLanguage.bind(mainHeader);

    mainHeader.switchLanguage = (language) => {
      originalSwitchLanguage(language);
      lang = language;
      renderTable();
    };
  } else {
    console.error(
      "main-header component not found or switchLanguage method is not defined."
    );
  }
});
