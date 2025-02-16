document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the stored file data from sessionStorage.
  const storedFileData = sessionStorage.getItem("uploadedFile");
  if (!storedFileData) {
    console.error("No file data found in sessionStorage.");
    document.getElementById('dyslexic_friendly_text').innerHTML = "Error: No file provided.";
    return;
  }
  const fileData = JSON.parse(storedFileData);

  // Reconstruct the Blob from the Data URL.
  // The Data URL is in the format: "data:[<mime type>];base64,<data>"
  const parts = fileData.data.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  const fileBlob = new Blob([u8arr], { type: mime });

  // Create a FormData object and append the file Blob.
  // The key 'document' must match what your backend expects.
  const formData = new FormData();
  formData.append('document', fileBlob, fileData.name);

  // Retrieve the selected font (optional) to send along or use on this page.
  const selectedFont = sessionStorage.getItem("selectedFont") || "'OpenDyslexic', Arial, sans-serif";

  // Send the FormData to your backend.
  fetch('https://h4h.pythonanywhere.com/', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    // Insert the returned content into the page.
    // The backend can optionally use the selected font when generating its output.
    document.getElementById('dyslexic_friendly_text').innerHTML = data;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('dyslexic_friendly_text').innerHTML = 'An error occurred: ' + error;
  });
});
