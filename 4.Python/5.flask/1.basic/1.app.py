from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def home():
    return "하이, Flask!"


@app.route("/user")
@app.route("/user/<int:user_id>")
def user(user_id):
    return f"<h1>하이, {user_id}!</h1>"


@app.route("/admin")
@app.route("/admin/<username>")
def admin(username="admin"):
    return f"<h1>하이, {username}!</h1>"


@app.route("/search")
def search():
    query = request.args.get("q")
    page = request.args.get("page", 1, type=int)
    return f"<h1>검색결과: {query} (Page: {page})</h1>"


if __name__ == "__main__":
    app.run(debug=True)
