from flask import Flask 
from config import Config 
from models.db import db
from models.user import User
from routes.user import user_bp
from routes.movies import movies_bp
from routes.auth import auth_bp
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config.from_object(Config)



db.init_app(app)

jwt  = JWTManager(app)

app.register_blueprint(movies_bp, url_prefix="/api/movies")

app.register_blueprint(user_bp, url_prefix="/api/users") 

app.register_blueprint(auth_bp, url_prefix="/api/auth")


@app.route("/")
def home():
    return "CineAddict Backend is Running!"

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)