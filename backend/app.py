from flask import Flask
from routes.movies import movies_bp

app = Flask(__name__)
app.register_blueprint(movies_bp, url_prefix="/api/movies")

@app.route("/")
def home():
    return "CineAddict Backend is Running!"


if __name__ == "__main__":
    app.run(debug=True)