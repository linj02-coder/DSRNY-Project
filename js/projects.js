const projectSearch = document.querySelector("#project-search-input");
const projectSearchForm = document.querySelector(".project-search");
const projectSort = document.querySelector("#project-sort");
const projectOrder = document.querySelector("#project-order");
const projectGrid = document.querySelector("#project-grid");
const projectCards = [...document.querySelectorAll(".project-card")];
const emptyState = document.querySelector(".project-empty-state");
const categoryDetails = [...document.querySelectorAll(".category-filter")];
const criterionButtons = [...document.querySelectorAll(".project-criterion")];
const resetFilter = document.querySelector(".project-filter-reset");
const viewButtons = [...document.querySelectorAll(".project-view-toggle button")];
let activeCriterion = "";
let activeCategory = "";

function updateProjects() {
  const query = projectSearch.value.trim().toLowerCase();
  const visibleCards = [];

  projectCards.forEach((card) => {
    const matchesSearch = card.dataset.name.toLowerCase().includes(query);
    const criteria = (card.dataset.criteria || "").split(" ");
    const categories = (card.dataset.categories || "").split(" ");
    const matchesCategory = !activeCriterion || !activeCategory || categories.includes(activeCategory);
    const matchesCriterion = !activeCriterion || criteria.includes(activeCriterion);
    const isVisible = matchesSearch && matchesCategory && matchesCriterion;

    card.hidden = !isVisible;
    if (isVisible) visibleCards.push(card);
  });

  visibleCards.sort((first, second) => {
    let comparison = 0;

    if (projectSort.value === "name") {
      comparison = first.dataset.name.localeCompare(second.dataset.name);
    } else if (projectSort.value === "newest") {
      comparison = Number(second.dataset.year) - Number(first.dataset.year);
    } else {
      comparison = projectCards.indexOf(first) - projectCards.indexOf(second);
    }

    return projectOrder.value === "descending" ? -comparison : comparison;
  });
  visibleCards.forEach((card) => projectGrid.append(card));
  emptyState.hidden = visibleCards.length > 0;
}

projectSearch.addEventListener("input", updateProjects);
projectSort.addEventListener("change", updateProjects);
projectOrder.addEventListener("change", updateProjects);
projectSearchForm.addEventListener("submit", (event) => event.preventDefault());

criterionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCriterion = button.dataset.criterion;
    criterionButtons.forEach((criterionButton) => {
      const isActive = criterionButton === button;
      criterionButton.classList.toggle("is-active", isActive);
      criterionButton.setAttribute("aria-pressed", String(isActive));
    });
    resetFilter.classList.remove("is-active");
    resetFilter.setAttribute("aria-pressed", "false");
    updateProjects();
  });
});

resetFilter.addEventListener("click", () => {
  activeCategory = "";
  activeCriterion = "";
  categoryDetails.forEach((category) => {
    category.open = false;
    category.classList.remove("is-active");
  });
  criterionButtons.forEach((button) => {
    button.classList.remove("is-active");
    button.setAttribute("aria-pressed", "false");
  });
  resetFilter.classList.add("is-active");
  resetFilter.setAttribute("aria-pressed", "true");
  updateProjects();
});

categoryDetails.forEach((category) => {
  category.addEventListener("toggle", () => {
    if (category.open) {
      categoryDetails.forEach((otherCategory) => {
        if (otherCategory !== category) otherCategory.open = false;
      });
      if (activeCategory !== category.dataset.category) {
        activeCategory = category.dataset.category;
        activeCriterion = "";
        criterionButtons.forEach((button) => {
          button.classList.remove("is-active");
          button.setAttribute("aria-pressed", "false");
        });
        resetFilter.classList.remove("is-active");
        resetFilter.setAttribute("aria-pressed", "false");
      }
    }
    category.classList.toggle("is-active", activeCategory === category.dataset.category);
    updateProjects();
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".project-category-bar")) {
    categoryDetails.forEach((category) => { category.open = false; });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    categoryDetails.forEach((category) => { category.open = false; });
  }
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.dataset.view === "grid";
    projectGrid.classList.toggle("is-list-view", !isActive);
    viewButtons.forEach((viewButton) => {
      const selected = viewButton === button;
      viewButton.classList.toggle("is-active", selected);
      viewButton.setAttribute("aria-pressed", String(selected));
    });
  });
});
