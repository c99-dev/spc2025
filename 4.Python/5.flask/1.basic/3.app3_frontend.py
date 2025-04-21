from flask import Flask, render_template, send_file

app = Flask(__name__)


@app.route("/")
def home(name):
    return render_template("index.html", name=name)


@app.route("/hello")
def static_home():
    return send_file("static/index.html")


if __name__ == "__main__":
    app.run(debug=True)
