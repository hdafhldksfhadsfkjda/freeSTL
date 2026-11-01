const searchInput = document.querySelector("#search-input");
const categoryButtons = [...document.querySelectorAll(".category-card")];
const year = document.querySelector("#year");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

year.textContent = new Date().getFullYear();

// Модели добавляются сюда по мере наполнения каталога.
// Поля: title, category, description, image, fileUrl.
const models = [];

let activeCategory = "all";

function renderCatalog() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleModels = models.filter((model) => {
    const matchesCategory = activeCategory === "all" || model.category === activeCategory;
    const searchableText = `${model.title} ${model.description}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });

  const grid = document.querySelector("#model-grid");
  const emptyState = document.querySelector("#empty-state");
  const resultsLabel = document.querySelector("#results-label");

  grid.replaceChildren();
  resultsLabel.textContent = query ? `Результаты поиска: ${visibleModels.length}` : "Подборка STL-файлов";

  if (visibleModels.length === 0) {
    emptyState.hidden = false;
    emptyState.querySelector("h3").textContent = query
      ? "Ничего не найдено"
      : "Здесь скоро появятся модели";
    emptyState.querySelector("p").textContent = query
      ? "Попробуй изменить запрос или выбрать другую категорию."
      : "Сейчас мы готовим каталог. Скоро здесь можно будет искать модели и скачивать STL-файлы.";
    return;
  }

  emptyState.hidden = true;
  visibleModels.forEach((model) => {
    const card = document.createElement("article");
    card.className = "model-card";
    const title = document.createElement("h3");
    title.textContent = model.title;
    const description = document.createElement("p");
    description.textContent = model.description;
    card.append(title, description);

    if (model.fileUrl) {
      const link = document.createElement("a");
      link.href = model.fileUrl;
      link.textContent = "Скачать STL →";
      link.className = "text-link";
      link.setAttribute("download", "");
      card.append(link);
    }
    grid.append(card);
  });
}

searchInput.addEventListener("input", renderCatalog);
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderCatalog();
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

renderCatalog();