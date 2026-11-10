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
const previousProjectPreview = carousel?.querySelector(".project-carousel__preview--previous");
const nextProjectPreview = carousel?.querySelector(".project-carousel__preview--next");
const featuredProjects = [
  { title: "The Shed", image: "images/theShedcarousel1.jpg" },
  { title: "The Shed", image: "images/theShedcarousel2.jpg" },
  { title: "The Shed", image: "images/theShedcarousel3.jpg" },
  { title: "The Shed", image: "images/theShedcarousel4.jpg" },
  { title: "MoMA", image: "images/momacarousel1.jpg" },
  { title: "MoMA", image: "images/momacarousel2.jpg" },
  { title: "MoMA", image: "images/moma_carousel3.jpg" },
  { title: "MoMA", image: "images/moma_carousel4.jpg" },
  { title: "The High Line", image: "images/DSRHighLine.jpg" },
  { title: "Lincoln Center", image: "images/DSRLincolnCenterPublicSpaces.jpg" },
  { title: "Therme Dubai", image: "images/DSRThermeDubai.jpg" },
  { title: "The Tide", image: "images/DSRTheTide.jpg" },
  { title: "Blur Building", image: "images/DSRBlurBuilding.jpg" },
  { title: "Hypar Pavilion", image: "images/DSRHyparPavilionandLincolnRistorante.jpg" },
  { title: "The Broad", image: "images/DSRTheBroad.jpg" },
  { title: "Zaryadye Park", image: "images/ZaryadyeParkCarousel.jpg" },
  { title: "Canal Cafe", image: "images/DSRCanalCafé.jpg" },
  { title: "Park Union Bridge", image: "images/DSRParkUnionBridge.jpg" },
  { title: "Upper Montparnasse", image: "images/DSRUpperMontparnaseeCarousel1.jpeg" },
  { title: "Upper Montparnasse", image: "images/DSRUpperMontparnaseeCarousel2.jpg" },
  { title: "Upper Montparnasse", image: "images/DSRUpperMontparnaseeCarousel3.jpeg" },
  { title: "The Brasserie", image: "images/DSRBrasserieCarousel1.jpg" },
  { title: "The Brasserie", image: "images/DSRBrasserieCarousel2.jpg" },
  { title: "The Brasserie", image: "images/DSRBrasserieCarousel3.jpg" },
  { title: "The Brasserie", image: "images/DSRBrasserieCarousel4.jpg" }
];
const projects = carousel?.dataset.images
  ? carousel.dataset.images.split("|").map((image) => ({ title: carousel.getAttribute("aria-label").replace(/ images$/, ""), image }))
  : featuredProjects;
let activeProject = 0;

function showProject(index) {
  if (!carouselImage || !carouselCount) return;

  activeProject = (index + projects.length) % projects.length;
  const projectNumber = String(activeProject + 1).padStart(2, "0");
  const project = projects[activeProject];
  const previousProject = projects[(activeProject - 1 + projects.length) % projects.length];
  const nextProject = projects[(activeProject + 1) % projects.length];

  carouselImage.src = project.image || `https://picsum.photos/seed/dsr-project-${projectNumber}/1800/650`;
  carouselImage.alt = project.title;
  if (carouselTitle) carouselTitle.textContent = project.title.toUpperCase();
  carouselCount.textContent = `${projectNumber} / ${String(projects.length).padStart(2, "0")}`;
  if (previousProjectPreview) previousProjectPreview.src = previousProject.image;
  if (nextProjectPreview) nextProjectPreview.src = nextProject.image;
}

carousel?.querySelector(".project-carousel__control--previous")?.addEventListener("click", () => {
  showProject(activeProject - 1);
});

carousel?.querySelector(".project-carousel__control--next")?.addEventListener("click", () => {
  showProject(activeProject + 1);
});