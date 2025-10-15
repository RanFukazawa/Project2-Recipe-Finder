// Rendering recipe page
export default function Finder() {
  const me = {};
  let page = new URLSearchParams(window.location.search).get("page") || 1;
  let totalPages = 5;

  // Show an error using bootstrap alerts in the main tag
  me.showError = ({ msg, res, type = "danger" } = {}) => {
    const main = document.querySelector("main");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.role = type;
    alert.innerText = `${msg}: ${res.status} ${res.statuText}`;
    main.prepend(alert);
  };

  // Single recipe
  const renderRecipe = (recipe) => `
    <div class="list-group-item">
    <h5 class="mb-1">${recipe.name.charAt(0).toUpperCase()}${recipe.name.slice(1)}</h5>
    <div>${recipe.minutes} min</div>
    <div>${recipe.ingredients.join(", ")}</div>
    </div>
    `;

  // A collection of recipe
  const renderRecipes = (recipes) => {
    const recipesDiv = document.getElementById("recipes");
    recipesDiv.innerHTML = `
    <h3 class="mt-4">All Recipes</h3>
    <div id="recipes-list" class="list-group mt-3">
      ${recipes.map(renderRecipe).join("\n")}
      ${recipes.length === 0 ? `<p>No recipes found.</p>` : ""}
    </div>
    `;
  };

  me.reloadFinder = async () => {
    const res = await fetch(`/api/recipes/?page=${page}`);
    if (!res.ok) {
      me.showError({ msg: "Failed to fetch recipes", res });
      console.error("Error fetching recipes:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    console.log("Fetched recipes data:", data);

    totalPages = data.totalPages || 5;
    page = data.page || page;

    renderRecipes(data.data);
    me.renderPagination();
  };

  const switchToPage =
    (newPage = 1) =>
    (e) => {
      e.preventDefault();
      page = newPage;
      me.reloadFinder();
    };

  const renderPages = (currentPage, totalPages) => {
    const fragment = document.createDocumentFragment();

    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(totalPages, currentPage + 3);

    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;

      const a = document.createElement("a");
      a.className = "page-link";
      a.href = "#";
      a.dataset.page = i;
      a.innerText = i;
      a.addEventListener("click", switchToPage(i));

      li.appendChild(a);
      fragment.appendChild(li);
    }
    return fragment;
  };

  me.renderPagination = () => {
    const paginationDiv = document.getElementById("pagination");
    const div = document.createElement("div");
    div.setAttribute("aria-label", "Page navigation example");

    const ul = document.createElement("ul");
    ul.className = "pagination";

    //Previous button
    const prevLi = document.createElement("li");
    prevLi.className = "page-item";
    const prevA = document.createElement("a");
    prevA.className = "page-link";
    prevA.href = "#";
    prevA.innerText = "Previous";
    prevA.addEventListener("click", switchToPage(Math.max(1, page - 1)));
    prevLi.appendChild(prevA);
    ul.appendChild(prevLi);

    // Page numbers
    ul.appendChild(renderPages(page, totalPages));

    // Next button
    const nextLi = document.createElement("li");
    nextLi.className = "page-item";
    const nextA = document.createElement("a");
    nextA.className = "page-link";
    nextA.href = "#";
    nextA.innerText = "Next";
    nextA.addEventListener(
      "click",
      switchToPage(Math.min(totalPages, parseInt(page) + 1)),
    );
    nextLi.appendChild(nextA);
    ul.appendChild(nextLi);

    div.appendChild(ul);
    paginationDiv.innerHTML = "";
    paginationDiv.appendChild(div);
  };

  return me;
}
