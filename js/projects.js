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

const projectSubcategories = {
  commercial: {
    urban: ["Upper Montparnasse", "Parco Romana", "London Wall West", "Google Pier 57"],
    nature: ["Therme Dubai", "Parco Romana", "Google Pier 57"],
    building: ["Pirelli 39", "Dissona Live-Work Complex", "Hypar Pavilion and Lincoln Ristorante"],
    sustainability: ["Therme Dubai", "Hypar Pavilion and Lincoln Ristorante"],
    realized: ["Parco Romana", "Google Pier 57"],
    landscape: ["Parco Romana", "Google Pier 57"],
    housing: ["Pirelli 39", "Dissona Live-Work Complex"],
    "high-rise": ["Upper Montparnasse", "Pirelli 39"],
    historic: ["London Wall West", "Hypar Pavilion and Lincoln Ristorante"],
    glass: ["Upper Montparnasse", "Pirelli 39"],
    competition: ["Upper Montparnasse", "Parco Romana"],
    "adaptive-reuse": ["Therme Dubai", "London Wall West"]
  },
  "public-space": {
    realized: ["Canal Cafe", "Park Union Bridge", "The High Line", "MoMA", "The Tide", "Zaryadye Park", "The Broad", "The Broad Plaza", "Wishard Pavilion", "Lincoln Center for the Performing Arts", "65th Street Bridge", "Lincoln Center Public Spaces", "Arbores Laetae (Joyful Trees)", "Blur Building"],
    urban: ["Canal Cafe", "Park Union Bridge", "The High Line", "The Tide", "Zaryadye Park", "The Broad Plaza", "Lincoln Center for the Performing Arts", "65th Street Bridge", "Lincoln Center Public Spaces"],
    "site-specific": ["Canal Cafe", "Park Union Bridge", "Zaryadye Park", "The Broad Plaza", "Wishard Pavilion", "65th Street Bridge", "Arbores Laetae (Joyful Trees)", "Blur Building"],
    public: ["Canal Cafe", "Park Union Bridge", "The High Line", "The Tide", "The Broad Plaza", "Wishard Pavilion", "Lincoln Center for the Performing Arts", "Lincoln Center Public Spaces"],
    sustainability: ["Canal Cafe", "Park Union Bridge", "The High Line", "The Tide", "Zaryadye Park", "Arbores Laetae (Joyful Trees)", "Blur Building"],
    nature: ["Canal Cafe", "Park Union Bridge", "The High Line", "The Tide", "Zaryadye Park", "Arbores Laetae (Joyful Trees)", "Blur Building"],
    social: ["Canal Cafe", "The High Line", "MoMA", "The Broad", "The Broad Plaza", "Wishard Pavilion"],
    landscape: ["Park Union Bridge", "The High Line", "The Tide", "Zaryadye Park", "65th Street Bridge", "Arbores Laetae (Joyful Trees)"],
    culture: ["MoMA", "The Broad", "The Broad Plaza", "Wishard Pavilion", "Lincoln Center for the Performing Arts", "Lincoln Center Public Spaces"],
    waterfront: ["Canal Cafe", "Park Union Bridge", "The High Line", "The Tide", "65th Street Bridge"],
    water: ["Canal Cafe", "Park Union Bridge", "The Tide", "Zaryadye Park", "Blur Building"],
    civic: ["Park Union Bridge", "Wishard Pavilion", "Lincoln Center for the Performing Arts", "65th Street Bridge", "Lincoln Center Public Spaces"],
    "adaptive-reuse": ["Canal Cafe", "The High Line", "The Tide", "The Broad Plaza", "Arbores Laetae (Joyful Trees)"],
    pavilion: ["Canal Cafe", "Zaryadye Park", "Wishard Pavilion", "Arbores Laetae (Joyful Trees)"],
    metal: ["Park Union Bridge", "65th Street Bridge", "Lincoln Center Public Spaces", "Blur Building"],
    interdisciplinary: ["Canal Cafe", "Lincoln Center for the Performing Arts", "65th Street Bridge", "Lincoln Center Public Spaces"],
    "independent-projects": ["MoMA", "The Broad", "The Broad Plaza", "Arbores Laetae (Joyful Trees)"],
    hybrid: ["Canal Cafe", "Park Union Bridge", "MoMA", "Lincoln Center for the Performing Arts"],
    competition: ["Park Union Bridge", "Zaryadye Park", "The Broad Plaza", "Wishard Pavilion"],
    climate: ["Canal Cafe", "The Tide", "Zaryadye Park", "Blur Building"]
  }
};

function matchesProjectCriterion(card, categoryName, criterion) {
  const subcategoryProjects = projectSubcategories[categoryName]?.[criterion];
  if (subcategoryProjects) return subcategoryProjects.includes(card.dataset.name);

  return (card.dataset.criteria || "").split(" ").includes(criterion);
}

function updateCriterionCounts() {
  categoryDetails.forEach((category) => {
    const categoryName = category.dataset.category;
    const categoryProjects = category.dataset.filterScope === "all"
      ? projectCards
      : projectCards.filter((card) =>
        (card.dataset.categories || "").split(" ").includes(categoryName)
      );

    category.querySelectorAll(".project-criterion").forEach((button) => {
      const criterion = button.dataset.criterion;
      const matchingProjects = new Set(
        categoryProjects
          .filter((card) => matchesProjectCriterion(card, categoryName, criterion))
          .map((card) => card.dataset.name)
      );
      let count = button.querySelector(".project-criterion__count");

      if (!count) {
        count = document.createElement("span");
        count.className = "project-criterion__count";
        button.append(count);
      }

      count.textContent = `(${matchingProjects.size})`;
    });
  });
}

function updateProjects() {
  const query = projectSearch.value.trim().toLowerCase();
  const visibleCards = [];

  projectCards.forEach((card) => {
    const matchesSearch = card.dataset.name.toLowerCase().includes(query);
    const categories = (card.dataset.categories || "").split(" ");
    const activeCategoryFilter = categoryDetails.find((category) => category.dataset.category === activeCategory);
    const matchesCategory = !activeCriterion || !activeCategory ||
      activeCategoryFilter?.dataset.filterScope === "all" || categories.includes(activeCategory);
    const matchesCriterion = !activeCriterion || !activeCategory || matchesProjectCriterion(card, activeCategory, activeCriterion);
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

updateCriterionCounts();
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
