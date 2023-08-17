from flask import Flask, json

app = Flask(__name__)

@app.route("/api/chat", methods = ['POST'])
def hello_world():
    response = app.response_class(
        response="olá from python :)",
        status=200,
        mimetype='application/json'
    )
    return response
