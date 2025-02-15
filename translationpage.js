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
