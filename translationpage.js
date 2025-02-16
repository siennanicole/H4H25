document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the stored file data from sessionStorage.
  const storedFileData = sessionStorage.getItem("fileData");
  if (!storedFileData) {
    console.error("No file data found in sessionStorage.");
    document.getElementById('dyslexic_friendly_text').innerHTML = "Error: No file provided.";
    return;
  }
  const fileData = JSON.parse(storedFileData);

  // Reconstruct the Blob from the Data URL.
  const parts = fileData.fileContent.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const fileBlob = new Blob([u8arr], { type: mime });

  // Create a FormData object and append the file Blob.
  const formData = new FormData();
  formData.append('document', fileBlob, fileData.fileName);

  // Send the FormData to your backend.
  fetch('https://h4h.pythonanywhere.com/', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      // Create a temporary container to parse the returned HTML.
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = data;
      // Try to extract text from a <pre> element, if present.
      let extractedText = "";
      if (tempDiv.querySelector("pre")) {
        extractedText = tempDiv.querySelector("pre").innerText;
      } else {
        extractedText = tempDiv.innerText || data;
      }
      // Set the text container's content to the extracted text.
      const textContainer = document.getElementById('dyslexic_friendly_text');
      textContainer.innerText = extractedText;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('dyslexic_friendly_text').innerHTML = 'An error occurred: ' + error;
    });

  // "New Document" button handler: redirect back to the upload page.
  document.getElementById("newDocumentButton").addEventListener("click", function () {
    window.location.href = "uploadpage.html";
  });

  // Get the elements for the font selector and the text container.
  const fontSelect = document.getElementById("fontSelect");
  const textContainer = document.getElementById("dyslexic_friendly_text");

  // When the font selection changes, update the text container's font.
  fontSelect.addEventListener("change", function () {
    textContainer.style.fontFamily = this.value;
  });

  // Update background color based on input.
  const bgColorInput = document.getElementById("bgColor");
  bgColorInput.addEventListener("input", function () {
    textContainer.style.backgroundColor = this.value;
  });

  // Update text color based on input.
  const textColorInput = document.getElementById("textColor");
  textColorInput.addEventListener("input", function () {
    textContainer.style.color = this.value;
  });
});
