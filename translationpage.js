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
  // The Data URL is in the format: "data:[<mime type>];base64,<data>"
  const parts = fileData.fileContent.split(',');
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
  formData.append('document', fileBlob, fileData.fileName);

  // Retrieve the selected font (if needed) to send along or use on this page.
  const selectedFont = fileData.selectedFont || "'OpenDyslexic', Arial, sans-serif";
  console.log("Selected font:", selectedFont);

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

  // Function to get selected text
  function getSelectedText() {
    const selection = window.getSelection();
    return selection.toString();
  }

  // Add event listener to Text-to-Speech button
  document.getElementById("textToSpeech").addEventListener("click", function () {
    const selectedText = getSelectedText();
    if (selectedText) {
      convertTextToSpeech(selectedText);
    } else {
      alert("Please highlight text to read aloud.");
    }
});

// Function to send selected text to backend for Text-to-Speech
async function convertTextToSpeech() {
  
    let play = document.getElementById("play");
      function playMusic(){
        let audio = Audio("output.mp3");
        audio.play()
      }
     play.addEventListener("click",playMusic);
}
});

document.getElementById("newDocumentButton").addEventListener("click", function () {
  window.location.href = "uploadpage.html"; 
});

document.getElementById('textToSpeech').addEventListener('click', function() {
  const fileInput = document.getElementById('output.mp3');
  const file = fileInput.files[0];  // Get the selected file


  if (!file) {
    alert("Please select an MP3 file first.");
    return;
  }


  const reader = new FileReader();


  reader.onloadend = function() {
    // Extract the Base64 part from the Data URL (after 'base64,')
    const base64Data = reader.result.split(',')[1];
    document.getElementById('base64Output').value = base64Data;  // Display Base64 string
  };


  reader.readAsDataURL(file);
});


document.addEventListener("DOMContentLoaded", function () {
  // Get color input elements
  const bgColorInput = document.getElementById("bgColor");
  const textColorInput = document.getElementById("textColor");
  const textContainer = document.getElementById("dyslexic_friendly_text");

  // Function to update background color
  bgColorInput.addEventListener("input", function () {
      textContainer.style.backgroundColor = bgColorInput.value;
  });

  // Function to update text color
  textColorInput.addEventListener("input", function () {
      textContainer.style.color = textColorInput.value;
  });
});
