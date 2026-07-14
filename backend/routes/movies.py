from flask import Blueprint,jsonify,request
from services.tmbd import get_trending_movies,search_movies,get_movie_details


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


@movies_bp.route("/<int:movie_id>")
def movie_details(movie_id):
    details =  get_movie_details(movie_id) 
    return jsonify(details)
