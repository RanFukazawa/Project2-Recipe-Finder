// Rendering recipe page
export default function Finder(config = {}) {
  const me = {};

  // Configuration with defaults
  const {
    apiEndpoint = "api/recipes",
    containerId = "recipes",
    paginationId = "pagination",
    showPagination = true,
    showActions = false,
  } = config;

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

  // Show success message
  me.showSuccess = (msg) => {
    const main = document.querySelector("main");
    const alert = document.createElement("div");
    alert.className = `alert alert-success alert-dismissible fade show`;
    alert.role = "alert";
    alert.innerHTML = `
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    main.prepend(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  };

  // Delete recipe
  const deleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      const res = await fetch(`${apiEndpoint}/${recipeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete recipe");
      }

      me.showSuccess("Recipe successfully deleted");
      me.reloadFinder();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  // Update recipe
  const editRecipe = async (recipeId) => {
    try {
      const res = await fetch(`${apiEndpoint}/${recipeId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch recipe.");
      }

      const recipe = await res.json();

      const event = new CustomEvent("openEditModal", { detail: recipe });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      alert("Failed to load recipe. Please try again.");
    }
  };

  // Single recipe
  const renderRecipe = (recipe) => `
    <div class="list-group-item">
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1">
          <h5 class="mb-1">${recipe.name.charAt(0).toUpperCase()}${recipe.name.slice(1)}</h5>
          <div class="text-muted">⏱️ ${recipe.minutes} min</div>
          <div class="mt-2">${recipe.ingredients.join(", ")}</div>
        </div>
        ${
          showActions
            ? `
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-outline-primary" onclick="window.editRecipe_${recipe._id}()">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.deleteRecipe_${recipe._id}()">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
          `
            : ""
        }
      </div>
    </div>
  `;

  // A collection of recipes
  const renderRecipes = (recipes) => {
    const recipesDiv = document.getElementById(containerId);

    // Check if recipesDiv exists
    if (!recipesDiv) {
      console.warn(`Container with id "${containerId}" not found`);
      return;
    }

    recipesDiv.innerHTML = `    
    <div id="recipes-list" class="list-group mt-3">
      ${recipes.map(renderRecipe).join("\n")}
      ${recipes.length === 0 ? `<p>No recipes found.</p>` : ""}
    </div>
    `;

    // Attach event handlers for edit/delete buttons
    if (showActions) {
      recipes.forEach((recipe) => {
        window[`editRecipe_${recipe._id}`] = () => editRecipe(recipe._id);
        window[`deleteRecipe_${recipe._id}`] = () => deleteRecipe(recipe._id);
      });
    }
  };

  me.reloadFinder = async () => {
    const url = showPagination ? `${apiEndpoint}?page=${page}` : apiEndpoint;

    console.log(`Fetching from: ${url}`);

    const res = await fetch(url);
    if (!res.ok) {
      me.showError({ msg: "Failed to fetch recipes", res });
      console.error("Error fetching recipes:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    console.log("Fetched recipes data:", data);

    if (showPagination && data.totalPages) {
      // Paginated response
      totalPages = data.totalPages;
      page = data.page || page;
      renderRecipes(data.data);
      me.renderPagination();
    } else {
      // Non-paginated response (just an array of recipes)
      renderRecipes(Array.isArray(data) ? data : data.data || []);

      if (showPagination) {
        const paginationDiv = document.getElementById(paginationId);
        if (paginationDiv) {
          paginationDiv.innerHTML = "";
        }
      }
    }
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
    const paginationDiv = document.getElementById(paginationId);

    if (!paginationDiv) {
      console.warn(`Pagination container with id "${paginationId}" not found`);
      return;
    }

    const div = document.createElement("div");
    div.setAttribute("aria-label", "Page navigation");

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

  window.addEventListener("reloadRecipes", () => {
    me.reloadFinder();
  });

  return me;
}
