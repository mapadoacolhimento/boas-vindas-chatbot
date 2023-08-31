try:
    import unzip_requirements
except ImportError:
    pass

from flask import Flask, jsonify, make_response
import os
from dotenv import load_dotenv

load_dotenv()

for name, value in os.environ.items():
    print("{0}: {1}".format(name, value))

app = Flask(__name__)

@app.route("/")
def hello_from_root():
    return jsonify(message='Hello from root!')

@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)
