from flask import Flask, jsonify, url_for
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

lol_images = ["ahri.png", "garen.png", "mell.png"]


@app.route("/random-champ")
def random_champ():
    random_image = random.choice(lol_images)
    image_url = url_for("static", filename=f"images/{random_image}", _external=True)

    return jsonify({"url": image_url})


if __name__ == "__main__":
    app.run(debug=True)
