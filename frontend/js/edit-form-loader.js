console.log("🔧 Edit form loader initialized");
const bootstrap = window.bootstrap;

// Listen for the edit modal trigger
window.addEventListener("openEditModal", async (event) => {
  const recipe = event.detail;
  let modal = document.getElementById("editRecipeModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "editRecipeModal";
    modal.className = "modal fade";
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Recipe</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="editModalFormContent">
            <!-- Form will be loaded here -->
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Load the edit form
  const modalBody = document.getElementById("editModalFormContent");

  try {
    const response = await fetch("/edit-form.html");
    const html = await response.text();
    modalBody.innerHTML = html;

    // Pre-fill the form with recipe data
    prefillEditForm(recipe);

    // Attach form submit handler
    attachEditFormHandler();

    // Show the modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  } catch (error) {
    console.error("Error loading edit form:", error);
    modalBody.innerHTML = '<p class="text-danger">Error loading form</p>';
  }
});

function prefillEditForm(recipe) {
  document.getElementById("edit-recipe-id").value = recipe._id;
  document.getElementById("edit-name").value = recipe.name;
  document.getElementById("edit-minutes").value = recipe.minutes;
  document.getElementById("edit-ingredients").value =
    recipe.ingredients.join("\n");
  document.getElementById("edit-steps").value = recipe.steps.join("\n");
}

function attachEditFormHandler() {
  const form = document.getElementById("editRecipeForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const recipeId = document.getElementById("edit-recipe-id").value;
    const nameValue = document.getElementById("edit-name").value;
    const minutesValue = document.getElementById("edit-minutes").value;
    const ingredientsText = document.getElementById("edit-ingredients").value;
    const stepsText = document.getElementById("edit-steps").value;

    const ingredients = ingredientsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const steps = stepsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (ingredients.length === 0 || steps.length === 0) {
      alert("Please provide at least one ingredient and one step.");
      return;
    }

    // Data to send
    const updateData = {
      _id: recipeId,
      name: nameValue.toLowerCase().trim(),
      minutes: parseInt(minutesValue),
      ingredients: ingredients,
      steps: steps,
    };

    console.log("Sending data:", updateData);

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    try {
      console.log(
        "🔄 Sending PUT request to:",
        `/api/user-recipes/${recipeId}`,
      );
      console.log("📦 Update data:", updateData);

      const response = await fetch(`/api/user-recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response ok:", response.ok);

      const responseText = await response.text();
      console.log("📥 Raw response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log("✅ Parsed result:", result);
      } catch (e) {
        console.error("❌ Failed to parse response:", e);
        alert("Server returned invalid response. Check console.");
        return;
      }

      if (response.ok) {
        alert("Recipe updated successfully!");

        // Close modal
        const modalElement = document.getElementById("editRecipeModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();

        // Reload recipes list
        window.dispatchEvent(new Event("reloadRecipes"));
      } else {
        alert(result.message || "Failed to update recipe");
      }
    } catch (error) {
      console.error("❌ Error updating recipe:", error);
      alert("An error occurred. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Save Changes";
    }
  });
}
