from flask import Blueprint, request, jsonify

from services.ai import get_ai_recommendations

ai_bp = Blueprint("ai", __name__) 

@ai_bp.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()
    
    prompt = data["prompt"] 

    response = get_ai_recommendations(prompt) 

    return jsonify({
        "response" : response
    })