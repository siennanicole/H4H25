#/var/www/h4h_pythonanywhere_com_wsgi.py

import sys

# Set project_home to the directory that contains your flask_app.py
project_home = '/home/h4h/mysite'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import your Flask app and call it "application" for WSGI to work
from flask_app import app as application  # noqa
