console.log("Hello from the frontend JavaScript file.");
import Finder from "./recipePage.js";

// Navigation bar and side bar
function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}
function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector(".menu-button");
  const closeBtn = document.querySelector(".close-sidebar");

  if (openBtn)
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSidebar();
    });

  if (closeBtn)
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hideSidebar();
    });

  // Initialize Finder only if the recipes container exists
  const recipesContainer = document.getElementById("recipes");
  console.log("recipes container:", recipesContainer); // Debug

  if (recipesContainer) {
    // Rendering external recipe data page
    console.log("Initializing external recipes finder"); // Debug
    const externalRecipes = Finder({
      apiEndpoint: "/api/recipes",
      title: "All Recipes",
      containerId: "recipes",
      paginationId: "pagination",
      showPagination: true,
    });
    externalRecipes.reloadFinder();
  }

  // Initialize user recipes finder if the container exits
  const userRecipesContainer = document.getElementById("user-recipes");
  console.log("user-recipes container:", userRecipesContainer); // Debug

  if (userRecipesContainer) {
    console.log("Initializing user recipes finder"); // Debug
    const userRecipes = Finder({
      apiEndpoint: "/api/user-recipes",
      title: "Custom Recipes",
      containerId: "user-recipes",
      paginationId: "user-pagination",
      showPagination: false,
    });
    userRecipes.reloadFinder();
  }
});
