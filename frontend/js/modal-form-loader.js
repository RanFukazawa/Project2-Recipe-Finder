const bootstrap = window.bootstrap;

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("recipeModal");

  if (modal) {
    modal.addEventListener("show.bs.modal", async () => {
      const modalBody = document.getElementById("modalFormContent");

      try {
        const response = await fetch("./submission-form.html");
        const html = await response.text();
        modalBody.innerHTML = html;

        attachFormHandler();
      } catch (error) {
        console.error("Error loading form:", error);
        modalBody.innerHTML = '<p class="text-danger">Error loading form</p>';
      }
    });
  }
});

function attachFormHandler() {
  const form = document.getElementById("recipeForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Form submitted!"); // Debug
    console.log("name element:", document.getElementById("name"));
    console.log("minutes element:", document.getElementById("minutes"));
    console.log("ingredients element:", document.getElementById("ingredients"));
    console.log("steps element:", document.getElementById("steps"));

    // Get form values
    const nameValue = document.getElementById("name").value;
    const minutesValue = document.getElementById("minutes").value;
    const ingredientsText = document.getElementById("ingredients").value;
    const stepsText = document.getElementById("steps").value;

    console.log("Form data:", {
      nameValue,
      minutesValue,
      ingredientsText,
      stepsText,
    }); // Debug

    const ingredients = ingredientsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const steps = stepsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    console.log("Parsed data:", { ingredients, steps }); // Debug

    // Validate arrays are not empty
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }

    if (steps.length === 0) {
      alert("Please add at least one step");
      return;
    }

    // Data to send
    const recipeData = {
      name: nameValue.trim(),
      minutes: parseInt(minutesValue),
      ingredients: ingredients,
      steps: steps,
    };

    console.log("Sending data:", recipeData); // Debug

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Uploading...";

    try {
      console.log("Fetching..."); // Debug
      const response = await fetch("/api/user-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      console.log("Response status:", response.status); // Add this
      console.log("Response headers:", response.headers.get("content-type"));

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        console.error("Response was:", responseText.substring(0, 200));
        alert(
          "Server error: Received HTML instead of JSON. Check console for details.",
        );
        return;
      }

      console.log("Parsed result", result); // Add this

      if (response.ok) {
        alert("Recipe uploaded successfully!");
        form.reset(); // Clear form

        // Close modal after 5 second
        setTimeout(() => {
          const modalElement = document.getElementById("recipeModal");
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) modal.hide();
        }, 5000);
      } else {
        alert(result.message || "Failed to upload recipe");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Upload";
    }
  });
}
