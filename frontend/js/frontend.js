console.log("Hello from the frontend JavaScript file.");

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

// Rendering recipes
function Finder() {
  const me = {};
  let currentPage = 1;
  const pageSize = 20;
  let totalRecipes = 0;

  me.showError = ({ msg, res, type = "danger" } = {}) => {
    // Show an error using bootstrap alerts in the main tag
    const main = document.querySelector("main");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.role = type;
    alert.innerText = `${msg}: ${res.status} ${res.statuText}`;
    main.prepend(alert);
  };

  const renderFinder = (recipes) => {
    const finderDiv = document.getElementById("recipes");
    finderDiv.innerHTML = "";

    for (const { name, minutes, ingredients } of recipes) {
      const card = document.createElement("div");
      card.className = "card mb-3";

      card.innerHTML = `
        <div><strong>${name.charAt(0).toUpperCase()}${name.slice(1)}</strong>
        <br>Cooking time: ${minutes} min 
        <br>Ingredients: ${ingredients}</div>
        `;
      finderDiv.appendChild(card);
    }
    updatePaginationControls();
  };

  const updatePaginationControls = () => {
    const paginationUl = document.getElementById("pagination");
    if (!paginationUl) return;

    const totalPages = Math.ceil(totalRecipes / pageSize);
    paginationUl.innerHTML = "";

    paginationUl.classList.add("justify-content-center");

    // Previous button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ""}>Previous</a>`;
    if (currentPage > 1) {
      prevLi.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        previousPage();
      });
    }
    paginationUl.appendChild(prevLi);

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      const pageLi = document.createElement("li");
      pageLi.className = `page-item ${i === currentPage ? "active" : ""}`;
      pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;

      if (i !== currentPage) {
        pageLi.querySelector("a").addEventListener("click", (e) => {
          e.preventDefault();
          goToPage(i);
        });
      }
      paginationUl.appendChild(pageLi);
    }
    // Next button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage >= totalPages ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link" href="#" ${currentPage >= totalPages ? 'tabindex="-1" aria-disabled="true"' : ""}>Next</a>`;
    if (currentPage < totalPages) {
      nextLi.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        nextPage();
      });
    }
    paginationUl.appendChild(nextLi);
  };

  const goToPage = async (page) => {
    currentPage = page;
    await me.reloadFinder();
  };

  const previousPage = async () => {
    if (currentPage > 1) {
      currentPage--;
      await me.reloadFinder();
    }
  };

  const nextPage = async () => {
    const totalPages = Math.ceil(totalRecipes / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      await me.reloadFinder();
    }
  };

  me.reloadFinder = async () => {
    const res = await fetch(
      `/api/recipes?page=${currentPage - 1}&pageSize=${pageSize}`,
    );
    if (!res.ok) {
      console.error("Error fetching recipes:", res.status, res.statusText);
      me.showError({ msg: "Failed to fetch recipes", res });
      return;
    }

    const data = await res.json();
    console.log("Fetched recipes:", data);

    totalRecipes = data.total || data.recipes.length;

    renderFinder(data.recipes);
  };

  return me;
}

const myRecipes = Finder();
myRecipes.reloadFinder();
