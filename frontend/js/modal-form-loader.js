document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("recipeModal");

  modal.addEventListener("show.bs.modal", () => {
    fetch("./form.html")
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("modalFormContent").innerHTML = html;
      })
      .catch((error) => {
        document.getElementById("modalFormContent").innerHTML =
          `<div class=alert alert-danger">Error loading form. Please try again.</div>`;
        console.error("Error laoding form:", error);
      });
  });
});
