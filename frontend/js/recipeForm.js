// document.getElementById("recipeForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   console.log("Form submitted!"); // Debug

//   // Get form values
//   const name = document.getElementById("name").ariaValueMax;
//   const minutes = document.getElementById("minutes").ariaValueMax;
//   const ingredientsText = document.getElementById("ingredients").value;
//   const stepsText = document.getElementById("step").value;

//   console.log("Form data:", { name, minutes, ingredientsText, stepsText }); // Debug

//   const ingredients = ingredientsText
//     .split("\n")
//     .map((item) => item.trim())
//     .filter((item) => item.length > 0);

//   const steps = stepsText
//     .splite("\n")
//     .map((item) => item.trim())
//     .filter((item) => item.length > 0);

//   console.log("Parsed data:", { ingredients, steps }); // Debug

//   // Validate arrays are not empty
//   if (ingredients.length === 0) {
//     showMessage("Please add at least one ingredient", "danger");
//     return;
//   }

//   if (steps.length === 0) {
//     showMessage("Please add at least one step", "danger");
//     return;
//   }

//   // Data to send
//   const recipeData = {
//     name: name.trim(),
//     minutes: parseInt(minutes),
//     ingredients: ingredients,
//     steps: steps,
//   };

//   console.log("Sending data:", recipeData); // Debug

//   const submitBtn = e.target.querySelector('button[type="submit"]');
//   submitBtn.disabled = true;
//   submitBtn.textContent = "Uploading...";

//   try {
//     console.log("Fetching..."); // Debug
//     const response = await fetch("/api/user-recipes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(recipeData),
//     });

//     console.log("Response status:", response.status); // Add this

//     const result = await response.json();

//     console.log("Response data:", result); // Add this

//     if (response.ok) {
//       showMessage("Recipe uploaded successfully!", "success");

//       // Clear form
//       document.getElementById("recipeForm").reset();
//     } else {
//       showMessage(result.message || "Failed to upload recipe", "danger");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     showMessage("Error. Please try again.", "danger");
//   } finally {
//     submitBtn.disabled = false;
//     submitBtn.textContent = "Upload";
//   }
// });

// // Display a message to the user
// function showMessage(message, type) {
//   const messageDiv = document.getElementById("message");
//   messageDiv.className = `alert alert-${type}`;
//   messageDiv.textContent = message;
//   messageDiv.classList.remove("d-none");

//   if (type === "success") {
//     setTimeout(() => {
//       messageDiv.classList.add("d-none");
//     }, 5000);
//   }
// }
