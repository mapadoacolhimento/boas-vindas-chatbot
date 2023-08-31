try:
    import unzip_requirements
except ImportError:
    pass

from flask import Flask, jsonify, make_response

app = Flask(__name__)

@app.route("/")
def hello_from_root():
    return jsonify(message='Hello from root!')

@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)
