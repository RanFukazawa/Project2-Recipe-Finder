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
});

// Rendering recipe page
const myRecipes = Finder();
myRecipes.reloadFinder();
