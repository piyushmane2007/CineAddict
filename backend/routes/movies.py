from flask import Blueprint,jsonify,request
from services.tmbd import get_trending_movies,search_movies


movies_bp = Blueprint("movies",__name__)

@movies_bp.route("/trending",methods=["GET"])
def trending_movies():
    movies = get_trending_movies()
    return jsonify(movies)

@movies_bp.route("/search", methods=["GET"])
def search_movies_route():
    query = request.args.get("query")

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    results = search_movies(query)
    return jsonify(results)