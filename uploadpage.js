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
            alert("Please upload a Document.");
            return;
        }

        // store data in sessionStorage (data will persist as long as the user stays on the site)
        sessionStorage.setItem("fileData", JSON.stringify(fileData));

        // redirect to the translation page
        window.location.href = "translationpage.html";
    });
});
