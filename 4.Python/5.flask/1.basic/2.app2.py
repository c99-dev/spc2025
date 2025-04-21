from flask import Flask, jsonify, request, make_response

app = Flask(__name__)

users = [
    {"id": 1, "name": "Alice", "age": 25, "phone": "010-1234-5678"},
    {"id": 2, "name": "Bob", "age": 30, "phone": "010-2345-6789"},
    {"id": 3, "name": "Charlie", "age": 35, "phone": "010-3456-7890"},
    {"id": 4, "name": "Alice", "age": 40, "phone": "010-4567-8901"},
]


@app.route("/")
def home():
    return "메인"


@app.route("/user")
def get_users():
    return jsonify(users)


@app.route("/user/<int:user_id>")
def get_user_by_id(user_id):
    user = next((user for user in users if user["id"] == user_id), None)
    if user is not None:
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404


@app.route("/search")
def search_user():
    name = request.args.get("name")
    if not name:
        # Flask 한글 깨짐 문제 해결을 위해 make_response 사용
        response = make_response(jsonify({"error": "이름은 필수 입니다."}), 400)
        response.headers["Content-Type"] = "application/json; charset=utf-8"
        return response

    result = [user for user in users if name.lower() in user["name"].lower()]
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
