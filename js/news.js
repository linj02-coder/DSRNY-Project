const newsSearch = document.querySelector("#news-search-input");
const newsSearchForm = document.querySelector(".news-search");
const newsSort = document.querySelector("#news-sort");
const newsOrder = document.querySelector("#news-order");
const newsGrid = document.querySelector("#news-grid");
const newsCards = [...document.querySelectorAll(".news-card")];
const newsEmptyState = document.querySelector(".news-empty-state");
const newsViewButtons = [...document.querySelectorAll(".news-view-toggle button")];
const featuredStory = document.querySelector(".news-featured__story");
const featuredStories = newsCards.map((card) => ({
  image: card.querySelector(".news-card__image img").getAttribute("src"),
  publication: card.dataset.publication,
  date: card.querySelector("time").textContent,
  title: card.dataset.title
}));
let activeFeaturedStory = 0;
const featuredImage = document.querySelector(".news-featured__image");
const previousFeaturedPreview = document.querySelector(".news-featured__preview--previous");
const nextFeaturedPreview = document.querySelector(".news-featured__preview--next");

function showFeaturedStory(index) {
  activeFeaturedStory = (index + featuredStories.length) % featuredStories.length;
  const story = featuredStories[activeFeaturedStory];
  const previousStory = featuredStories[(activeFeaturedStory - 1 + featuredStories.length) % featuredStories.length];
  const nextStory = featuredStories[(activeFeaturedStory + 1) % featuredStories.length];
  const publication = featuredStory.querySelector(".news-featured__publication");
  publication.firstChild.textContent = `${story.publication} `;
  publication.querySelector("span").textContent = `(${story.date})`;
  featuredStory.querySelector(".news-featured__headline").textContent = story.title;
  featuredImage.src = story.image;
  previousFeaturedPreview.src = previousStory.image;
  nextFeaturedPreview.src = nextStory.image;
}

function updateNews() {
  const query = newsSearch.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visibleCards = [];

  newsCards.forEach((card) => {
    const searchableText = [
      card.textContent,
      card.dataset.title,
      card.dataset.publication,
      card.dataset.author,
      card.dataset.date
    ].join(" ").toLocaleLowerCase();
    const isVisible = query.every((term) => searchableText.includes(term));
    card.hidden = !isVisible;
    if (isVisible) visibleCards.push(card);
  });

  visibleCards.sort((first, second) => {
    let comparison = 0;
    if (newsSort.value === "title") {
      comparison = first.dataset.title.localeCompare(second.dataset.title);
    } else if (newsSort.value === "date") {
      comparison = first.dataset.date.localeCompare(second.dataset.date);
    } else {
      comparison = newsCards.indexOf(first) - newsCards.indexOf(second);
    }

    return newsOrder.value === "descending" ? -comparison : comparison;
  });

  visibleCards.forEach((card) => newsGrid.append(card));
  newsEmptyState.hidden = visibleCards.length > 0;
}

document.querySelector(".news-featured__control--previous").addEventListener("click", () => {
  showFeaturedStory(activeFeaturedStory - 1);
});
document.querySelector(".news-featured__control--next").addEventListener("click", () => {
  showFeaturedStory(activeFeaturedStory + 1);
});
newsSearch.addEventListener("input", updateNews);
newsSort.addEventListener("change", updateNews);
newsOrder.addEventListener("change", updateNews);
newsSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateNews();
});

newsViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isGridView = button.dataset.view === "grid";
    newsGrid.classList.toggle("is-list-view", !isGridView);
    newsViewButtons.forEach((viewButton) => {
      const selected = viewButton === button;
      viewButton.classList.toggle("is-active", selected);
      viewButton.setAttribute("aria-pressed", String(selected));
    });
  });

  showFeaturedStory(activeFeaturedStory);
});
