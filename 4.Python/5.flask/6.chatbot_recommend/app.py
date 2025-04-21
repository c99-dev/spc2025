from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import os
import json
import time

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

movies_path = os.path.join(os.path.dirname(__file__), "static", "movies.json")

with open(movies_path, "r", encoding="utf-8") as f:
    movies = json.load(f)
movies_count = len(movies)


@app.route("/chatbot", methods=["POST"])
def chatbot():
    time.sleep(1)
    question = request.json.get("question", "")
    if question == "추천":
        random_movie_rank = random.randint(1, movies_count)
        return jsonify(
            {
                "answer": "추천 영화: " f"\"{movies[random_movie_rank - 1]['title']}\"",
                "rank": random_movie_rank,
            }
        )

    return jsonify({"answer": "Python: " + question})


if __name__ == "__main__":
    app.run(debug=True)
