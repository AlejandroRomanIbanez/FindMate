from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user_model import UserRegistration, UserLogin
from app.services.auth_service import register_user, login_user
from app.utils.custom_errors import UserAlreadyExistsError, UserNotFoundError, IncorrectPasswordError
from pydantic import ValidationError


def register():
    """
        Register a new user.

        Receives user registration data from the request, registers the user,
        and returns a JSON response with a success or error message and an HTTP status code.

        Returns:
            tuple: JSON response and HTTP status code.
    """
    try:
        data = UserRegistration(**request.get_json())
    except ValidationError as e:
        return jsonify({'error': 'Invalid input. Please check your fields and try again.'}), 422

    try:
        response, status = register_user(data)
    except UserAlreadyExistsError as e:
        return jsonify({'error': str(e)}), 400
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except TypeError as e:
        return jsonify({'error': str(e)}), 400
    return jsonify(response), status


def login():
    """
    Login a user.

    Receives user login data from the request, authenticates the user,
    and returns a JSON response with an access token or an error message and an HTTP status code.

    Returns:
        tuple: JSON response and HTTP status code.
    """
    try:
        data = UserLogin(**request.get_json())
    except ValidationError:
        return jsonify({'error': 'Invalid input. Please check your fields and try again.'}), 422
    try:
        user = login_user(data)
    except UserNotFoundError as e:
        return jsonify({'error': str(e)}), 404
    except IncorrectPasswordError as e:
        return jsonify({'error': str(e)}), 401
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except TypeError as e:
        return jsonify({'error': str(e)}), 400
    access_token = create_access_token(identity=str(user['_id']))
    return jsonify({'access_token': access_token}), 200
