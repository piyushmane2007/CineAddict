from flask import Blueprint, request, jsonify

from services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__) 

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    user = register_user(
        username= data["username"],
        email=data["email"],
        password=data["password"]
    ) 

    if user is None : 
        return jsonify({
            "Error":"Email already exists"
        }),409 
    
    return jsonify({
        "message":"User registered successfully"
    }),201 

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user = login_user(
        email=data["email"],
        password=data["password"]
    )

    if user is None:
        return jsonify({
            "Error": "Invalid email or password"
        }),401 
    
    return jsonify({
        "message" : "Login successful",
        "user" : {
            "id":user.id,
            "username":user.username,
            "email": user.email,
        }
    }), 200 

