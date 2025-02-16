from flask import Flask, request, render_template_string, send_file, session, redirect, url_for
import os
import PyPDF2
import docx
from io import BytesIO
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key'

def extract_text_pdf(file_stream):
    reader = PyPDF2.PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        text += (page.extract_text() or "") + "\n"
    return text

def extract_text_docx(file_stream):
    doc = docx.Document(file_stream)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'document' not in request.files:
            return "No file part in the request."
        file = request.files['document']
        if file.filename == '':
            return "No file selected."
        filename = secure_filename(file.filename)
        file_ext = os.path.splitext(filename)[1].lower()

        try:
            if file_ext == '.pdf':
                extracted_text = extract_text_pdf(file)
            elif file_ext in ['.docx', '.doc']:
                extracted_text = extract_text_docx(file)
            elif file_ext == '.txt':
                extracted_text = file.read().decode('utf-8')
            else:
                return "Unsupported file type. Please upload a PDF, DOCX, or TXT file."
        except Exception as e:
            return f"Error processing file: {e}"

        # Store the extracted text in the session so it can be downloaded later
        session['extracted_text'] = extracted_text

        return render_template_string("""
        <!doctype html>
        <html>
        <head>
            <title>Extracted Text</title>
            <!-- Load OpenDyslexic from a CDN (using jsDelivr) -->
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@1.0.0/open-dyslexic.css">
            <style>
                body {
                    margin: 20px;
                }
                #textContainer {
                    white-space: pre-wrap;
                    background: #f9f9f9;
                    padding: 10px;
                    border: 1px solid #ccc;
                    font-size: 16px;
                    font-family: 'OpenDyslexic', Arial, sans-serif;
                }
            </style>
        </head>
        <body>
            <h2>Extracted Text</h2>
            <!-- Font and size controls -->
            <div>
                <label for="fontSelect">Choose a font:</label>
                <select id="fontSelect" onchange="updateFont()">
                    <option value="'OpenDyslexic', Arial, sans-serif">OpenDyslexic</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                </select>
                <label for="fontSize">Font size:</label>
                <input type="number" id="fontSize" value="16" onchange="updateFontSize()" style="width:60px;">
            </div>
            <br>
            <div id="textContainer">{{ text }}</div>
            <br>
            <a href="{{ url_for('download_text') }}">Download as TXT file</a>
            <br><br>
            <a href="{{ url_for('upload_file') }}">Upload another file</a>
            <script>
                function updateFont() {
                    var font = document.getElementById('fontSelect').value;
                    document.getElementById('textContainer').style.fontFamily = font;
                }
                function updateFontSize() {
                    var size = document.getElementById('fontSize').value;
                    document.getElementById('textContainer').style.fontSize = size + "px";
                }
            </script>
        </body>
        </html>
        """, text=extracted_text)

    # GET request: Display the upload form
    return '''
    <!doctype html>
    <html>
    <head>
        <title>Upload Document</title>
    </head>
    <body>
        <h1>Upload Document</h1>
        <form method="post" enctype="multipart/form-data">
            <input type="file" name="document">
            <input type="submit" value="Upload">
        </form>
    </body>
    </html>
    '''

@app.route('/download')
def download_text():
    extracted_text = session.get('extracted_text')
    if not extracted_text:
        return redirect(url_for('upload_file'))
    return send_file(BytesIO(extracted_text.encode('utf-8')),
                     as_attachment=True,
                     download_name="extracted_text.txt",
                     mimetype='text/plain')

if __name__ == '__main__':
    app.run(debug=True)
