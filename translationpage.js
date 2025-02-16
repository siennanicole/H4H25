document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the stored file data from sessionStorage.
  const storedFileData = sessionStorage.getItem("fileData");
  if (!storedFileData) {
    console.error("No file data found in sessionStorage.");
    document.getElementById('dyslexic_friendly_text').innerText = "Error: No file provided.";
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
      // Put the returned text into a string.
      let extractedText = data;
      // Remove leading/trailing whitespace.
      extractedText = extractedText.trim();
      // Update the text container with the cleaned text.
      const textContainer = document.getElementById('dyslexic_friendly_text');
      textContainer.innerText = extractedText;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('dyslexic_friendly_text').innerText = 'An error occurred: ' + error;
    });

  // "New Document" button: redirect to upload page.
  document.getElementById("newDocumentButton").addEventListener("click", function () {
    window.location.href = "uploadpage.html";
  });

  // Get the elements for the font selector, font size input, and the text container.
  const fontSelect = document.getElementById("fontSelect");
  const fontSizeInput = document.getElementById("fontSizeInput"); // Make sure this element exists in your HTML.
  const textContainer = document.getElementById("dyslexic_friendly_text");

  // When the font selection changes, update the text container's font.
  fontSelect.addEventListener("change", function () {
    textContainer.style.fontFamily = this.value;
  });

  // When the font size input changes, update the text container's font size.
  if (fontSizeInput) {
    fontSizeInput.addEventListener("input", function () {
      textContainer.style.fontSize = this.value + "px";
    });
  }

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

document.addEventListener('DOMContentLoaded', function () {
   const text = "hello how are you?";
   const convertBtn = document.getElementById("textToSpeech");

   convertBtn.addEventListener('click', function () {
       const speechSynth = window.speechSynthesis;
       const enteredText = text;
       const error = document.querySelector('.error-para');

       // Check if the error element exists
       if (error) {
           if (!speechSynth.speaking && !enteredText.trim().length) {
               error.textContent = `Nothing to Convert! Enter text in the text area.`;
           }

           if (!speechSynth.speaking && enteredText.trim().length) {
               error.textContent = "";
               const newUtter = new SpeechSynthesisUtterance(enteredText);
               speechSynth.speak(newUtter);
               convertBtn.textContent = "Sound is Playing...";
           }

           setTimeout(() => {
             convertBtn.textContent = "Read Aloud";
           }, 5000);
       } else {
           console.error("Error element not found!");
       }
   });
});
