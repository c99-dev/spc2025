from flask import Flask, render_template

app = Flask(__name__)

users = ["Alice", "Bob", "Charlie", "David", "Eve"]


@app.route("/")
def home():
    return render_template("index.html", name="jhon")


@app.route("/users")
def get_users():
    return render_template("users.html", users=users)


if __name__ == "__main__":
    app.run(port=5000, host="0.0.0.0", debug=True)
