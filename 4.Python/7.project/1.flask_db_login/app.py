from flask import Flask, request
import sqlite3


app = Flask(__name__)


@app.route("/")
def home():
    return app.send_static_file("index.html")


@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE name=? AND password=?", (username, password)
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        return "로그인 성공"
    else:
        return "로그인 실패"


if __name__ == "__main__":
    app.run(debug=True)
