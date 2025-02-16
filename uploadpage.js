document.addEventListener("DOMContentLoaded", function() {
  // Get the form element
  const form = document.querySelector("form");

  // Listen for form submission
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get the selected font (if needed)
    const selectedFont = document.getElementById("font-select").value;

    // Get the uploaded file
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please upload a Document.");
      return;
    }

    // Read the file as a Data URL using FileReader.
    const reader = new FileReader();
    reader.onload = function(e) {
      // e.target.result is a Data URL (e.g., "data:application/pdf;base64,...")
      const fileData = {
        name: file.name,
        type: file.type,
        data: e.target.result
      };

      // Store the file data and the selected font in sessionStorage.
      // IMPORTANT: This value is required for the translation page to work.
      sessionStorage.setItem("uploadedFile", JSON.stringify(fileData));
      sessionStorage.setItem("selectedFont", selectedFont);

      // Redirect to the translation page.
      window.location.href = "translationpage.html";
    };
    reader.readAsDataURL(file);
  });
});
