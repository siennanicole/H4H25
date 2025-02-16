document.addEventListener("DOMContentLoaded", function () {
  // IMPORTANT:
  // You need to supply the "uploadedFile" variable with the File object from the previous page's file input.
  // For example, if you stored it in sessionStorage after the file was selected, retrieve it here.
  // The following is a placeholder:
  //
  // let uploadedFile = JSON.parse(sessionStorage.getItem('uploadedFile'));
  //
  // OR if you're using a global variable, ensure that "uploadedFile" is defined.
  //
  // For this demo, we'll assume that "uploadedFile" is already defined.
  
  if (typeof uploadedFile === 'undefined' || !uploadedFile) {
    console.error("No file provided. Please supply the file from the previous page's input.");
    document.getElementById('dyslexic_friendly_text').innerHTML = "Error: No file provided.";
    return;
  }

  // Create a FormData object and append the file.
  // The key "document" must match what your backend expects.
  var formData = new FormData();
  formData.append('document', uploadedFile, uploadedFile.name);

  // Optionally, you could add more form fields here if needed.
  // For example: formData.append('font', selectedFont);

  // Send the file to your backend (assumed to be at this URL) and capture the response.
  fetch('https://h4h.pythonanywhere.com/', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    // Insert the returned content into the container.
    document.getElementById('dyslexic_friendly_text').innerHTML = data;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('dyslexic_friendly_text').innerHTML = 'An error occurred: ' + error;
  });
});
