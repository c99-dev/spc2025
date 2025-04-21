from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


@app.route("/chatbot", methods=["POST"])
def chatbot():
    time.sleep(1)
    question = request.json.get("question", "")
    return jsonify({"answer": "Python: " + question})


if __name__ == "__main__":
    app.run(debug=True)
