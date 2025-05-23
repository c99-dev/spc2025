from flask import Flask, send_from_directory, request, jsonify
import os

from database import create_vector_db, answer_question, list_files, delete_file

app = Flask(__name__)

DATA_DIR = "./DATA"

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)


@app.route("/")
def index():
    return send_from_directory("static", "index.html")


@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    if file:
        file_path = os.path.join(DATA_DIR, file.filename)
        file.save(file_path)
        create_vector_db(file_path)
        return jsonify({"message": "파일이 성공적으로 업로드 되었습니다."})


@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.get_json()
    question = data.get("question", "")
    answer = answer_question(question)
    return jsonify({"message": f"질문은 '{question}' 입니다.", "answer": answer})


@app.route("/files", methods=["GET"])
def get_files():
    files = list_files(DATA_DIR)
    return jsonify({"files": files})


@app.route("/delete", methods=["DELETE"])
def delete_file_route():
    data = request.get_json()
    filename = data.get("filename", "")
    if filename:
        file_path = os.path.join(DATA_DIR, filename)
        if delete_file(file_path):
            return jsonify(
                {"message": f"파일 '{filename}'이 성공적으로 삭제되었습니다."}
            )
        else:
            return jsonify({"message": f"파일 '{filename}'을 삭제할 수 없습니다."}), 400
    return jsonify({"message": "파일 이름이 제공되지 않았습니다."}), 400


if __name__ == "__main__":
    app.run(debug=True)
