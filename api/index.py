from flask import Flask, json

app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    data = "hello WORLD"
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response
