from flask import Blueprint,jsonify,request
from services.tmbd import get_trending_movies,search_movies,get_movie_details,get_movie_trailer,get_movie_credits


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

@movies_bp.route("/<int:movie_id>/trailer")
def movie_trailer(movie_id):
    trailer =  get_movie_trailer(movie_id) 
    return jsonify(trailer) 

@movies_bp.route("/<int:movie_id>/credits")
def movie_credits(movie_id):
    credits =  get_movie_credits(movie_id) 
    return jsonify(credits) 

