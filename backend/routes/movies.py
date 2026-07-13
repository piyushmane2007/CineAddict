from flask import Blueprint,jsonify
from services.tmbd import get_trending_movies

movies_bp = Blueprint("movies",__name__)

@movies_bp.route("/trending",methods=["GET"])
def trending_movies():
    movies = get_trending_movies()
    return jsonify(movies)

