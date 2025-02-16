document.addEventListener("DOMContentLoaded", function() {
  // Get the form element
  const form = document.querySelector("form");

  // Handle/listen for form submission
  form.addEventListener("submit", function(event) {
    // Prevent default page reload
    event.preventDefault();
    
    // Get the selected font from the dropdown
    const selectedFont = document.getElementById("font-select").value;

    // Get the uploaded file 
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0]; 

    if (!file) {
      alert("Please upload a document file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file); // Converts file to a base64 string

    reader.onload = function() {
      // Create an object with file details.
      // NOTE: We store this under the key "fileData". This value is required by the translation page.
      const fileData = {
        fileName: file.name,
        selectedFont: selectedFont,
        fileContent: reader.result // base64-encoded file content
      };

      // Debug: log the fileData before storing it
      console.log("Storing file data:", fileData);

      sessionStorage.setItem("fileData", JSON.stringify(fileData));

      // Debug: log the sessionStorage contents to verify it was set
      console.log("sessionStorage fileData:", sessionStorage.getItem("fileData"));

      // Redirect to the translation page.
      window.location.href = "translationpage.html";
    };

    reader.onerror = function() {
      alert("Error reading file.");
    };
  });
});
