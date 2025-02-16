import fs from "fs";

function extractTextFromJsonPdf(jsonFilePath) {
    try {
      // Read the JSON file
        const jsonData = fs.readFileSync(jsonFilePath, "utf8");

        // Parse JSON
        const pdfData = JSON.parse(jsonData);

        // Extract text content (Assumes PDF text is stored under "text" or similar key)
        if (pdfData.raw_text) {
            return pdfData.raw_text;
        } else if (Array.isArray(pdfData.page_data)) {
            // If text is stored page-wise, concatenate all pages
            return pdfData.page_data.map(page => page.raw_text).join("\n");
        } else {
            throw new Error("No text found in JSON file.");
        }
    } catch (error) {
        console.error("Error reading JSON PDF file:", error);
        return null;
    }
}

// Example usage:
const text = extractTextFromJsonPdf("export (1).json");
console.log(text);


function dyslexicFriendlyTxt(text) {
    let textFormatting = text
    .replace(/(\w{8,})/g, '<b>$1</b>')
    .replace(/\n/g, '<br><br>');

    let outputs = document.getElementById("dyslexic_friendly_text");
    outputs.innerHTML = textFormatting;

    outputs.style.fontFamily = "OpenDyslexic, Arial, Comic-Sans, sans-serif"
    outputs.style.fontSize = "20px";
    outputs.style.lineHeight = "2.0";
    outputs.style.backgroundColor = "#f7f7f7";
    outputs.style.padding = "15px";
    outputs.style.borderRadius = "10px";
}
