document.addEventListener("DOMContentLoaded", function() {
    
    // get the form element
    const form = document.querySelector("form");

    // handel/listen for form submission
    form.addEventListener("submit", function(event) {
        // prevent default reload the page
        event.preventDefault();
        
        // get the selected font
        const selectedFont = document.getElementById("font-select").value;

        // get the uploaded file 
        const fileInput = document.getElementById("file-upload");
        const file = fileInput.files[0]; 

        if (!file) {
            alert("Please upload a PDF file.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file); // Converts file to a base64 string

        reader.onload = function() {
            // store file data in sessionStorage
            const fileData = {
                fileName: file.name,
                selectedFont: selectedFont,
                fileContent: reader.result // base64-encoded file content
            };

            sessionStorage.setItem("fileData", JSON.stringify(fileData));

            // redirect to the translation page
            window.location.href = "translationpage.html";
        };

        reader.onerror = function() {
            alert("Error reading file.");
        };
    });
});

