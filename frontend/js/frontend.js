console.log("Hello from the frontend JavaScript file.");

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

function Finder() {
  const finder = {};

  finder.reloadFinder = async () => {
    const res = await fetch("/api/recipes");
    if (!res.ok) {
      document.querySelector("main").innerHTML += `
      <div class="alert alert-danger" role="alert">
        Error fetching recipes: ${res.status} ${res.statusText}
      </div>
      `;
      console.error("Error fetching recipes:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    console.log("Fetched recipes data:", data);

    const finderDiv = document.getElementById("recipes");
    finderDiv.innerHTML += `
    <h3 class="mt-4">Recipes List</h3>
    <div id="recipes-list" class="list-group mt-3">
      <pre>
        Recipes: ${JSON.stringify(data, null, 2)}
      </pre>
    </div>
    `;
  };

  return finder;
}

const find = Finder();
find.reloadFinder();
