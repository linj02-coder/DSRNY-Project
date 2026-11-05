const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  primaryNavigation?.classList.toggle("is-open", !isExpanded);
});

const carousel = document.querySelector(".project-carousel");
const carouselImage = carousel?.querySelector(".project-carousel__image");
const carouselTitle = carousel?.querySelector(".project-carousel__title");
const carouselCount = carousel?.querySelector(".project-carousel__count");
const projects = [
  { title: "The Shed", image: "images/theShedcarousel1.jpg" },
  { title: "The Shed", image: "images/theShedcarousel2.jpg" },
  { title: "The Shed", image: "images/theShedcarousel3.jpg" },
  { title: "The Shed", image: "images/theShedcarousel4.jpg" },
  { title: "MoMA", image: "images/momacarousel1.jpg" },
  { title: "MoMA", image: "images/momacarousel2.jpg" },
  { title: "MoMA", image: "images/moma_carousel3.jpg" },
  { title: "MoMA", image: "images/moma_carousel4.jpg" },
  { title: "The High Line" },
  { title: "Lincoln Center" },
  { title: "Institute of Contemporary Art" },
  { title: "The Tide" },
  { title: "MoMA Expansion" },
  { title: "Blur Building" },
  { title: "Hypar Pavilion" },
  { title: "V&A Museum" },
  { title: "The Shed" },
  { title: "Public Space" },
  { title: "Cultural Center" },
  { title: "Urban Waterfront" }
];
let activeProject = 0;

function showProject(index) {
  if (!carouselImage || !carouselTitle || !carouselCount) return;

  activeProject = (index + projects.length) % projects.length;
  const projectNumber = String(activeProject + 1).padStart(2, "0");
  const project = projects[activeProject];

  carouselImage.src = project.image || `https://picsum.photos/seed/dsr-project-${projectNumber}/1800/650`;
  carouselImage.alt = project.title;
  carouselTitle.textContent = project.title.toUpperCase();
  carouselCount.textContent = `${projectNumber} / ${String(projects.length).padStart(2, "0")}`;
}

carousel?.querySelector(".project-carousel__control--previous")?.addEventListener("click", () => {
  showProject(activeProject - 1);
});

carousel?.querySelector(".project-carousel__control--next")?.addEventListener("click", () => {
  showProject(activeProject + 1);
});