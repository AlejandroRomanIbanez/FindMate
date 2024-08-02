from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user_model import UserRegistration, UserLogin
from app.services.auth_service import register_user, login_user


def register():
    """
        Register a new user.

        Receives user registration data from the request, registers the user,
        and returns a JSON response with a success or error message and an HTTP status code.

        Returns:
            tuple: JSON response and HTTP status code.
    """
    data = UserRegistration(**request.get_json())
    response, status = register_user(data)
    return jsonify(response), status


def login():
    """
    Login a user.

    Receives user login data from the request, authenticates the user,
    and returns a JSON response with an access token or an error message and an HTTP status code.

    Returns:
        tuple: JSON response and HTTP status code.
    """
    data = UserLogin(**request.get_json())
    user = login_user(data)
    if 'error' in user:
        return jsonify(user), 401

    access_token = create_access_token(identity=str(user['_id']))
    return jsonify({'access_token': access_token}), 200
