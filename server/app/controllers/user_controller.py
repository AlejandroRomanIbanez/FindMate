from datetime import datetime, timezone

from bson import ObjectId
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.helpers import serialize_object_id
from app.models.user_model import EditUser, UserWithoutPassword
from app.services.user_service import update_user, get_all_users, get_user_by_username, add_friend, remove_friend, \
    get_user_by_id, add_hobby, get_hobbies, delete_hobby, buy_sub
from flask import jsonify
from .. import mongo


@jwt_required()
def fetch_current_user():
    current_user_id = get_jwt_identity()
    user, status = get_user_by_id(current_user_id)

    # Use the UserWithoutPassword model to exclude the password field
    user_obj = UserWithoutPassword(**user)
    user_obj.is_subscription_active()

    # Save any changes back to the database (if subscription was marked inactive)
    mongo.social.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$set': {
            'isPaid': user_obj.isPaid,
            'subscription_end_date': user_obj.subscription_end_date
        }}
    )

    return jsonify(user_obj.to_dict()), status

@jwt_required()
def buy_sub_endpoint():
    current_user_id = get_jwt_identity()
    response, status = buy_sub(current_user_id)
    return jsonify(response), status



@jwt_required()
def fetch_user_by_username(username):
    user, status = get_user_by_username(username)
    user.pop('password')
    return jsonify(user), status


@jwt_required()
def fetch_all_users():
    users = get_all_users()
    for user in users:
        user.pop('password')
    users = serialize_object_id(users)
    return jsonify(users), 200


@jwt_required()
def edit_user():
    """
    Edit user details.

    Receives user update data from the request, updates the user information,
    and returns a JSON response with a success or error message and an HTTP status code.

    Returns:
        tuple: JSON response and HTTP status code.
    """
    user_id = get_jwt_identity()
    data = EditUser(**request.get_json())
    response, status = update_user(user_id, data)
    return jsonify(response), status


@jwt_required()
def add_friend_endpoint():
    """
    Endpoint to add a friend.

    Receives the target user ID from the request, updates the friend relationships,
    and returns a JSON response with a success or error message and an HTTP status code.

    Returns:
        tuple: JSON response and HTTP status code.
    """
    current_user_id = get_jwt_identity()
    target_user_id = request.json.get('target_user_id')

    if not target_user_id:
        return jsonify({'error': 'Target user ID is required'}), 400

    response, status = add_friend(current_user_id, target_user_id)
    return jsonify(response), status


@jwt_required()
def remove_friend_endpoint():
    """
    Endpoint to remove a friend.

    Receives the target user ID from the request, updates the friend relationships,
    and returns a JSON response with a success or error message and an HTTP status code.

    Returns:
        tuple: JSON response and HTTP status code.
    """
    current_user_id = get_jwt_identity()
    target_user_id = request.json.get('target_user_id')

    if not target_user_id:
        return jsonify({'error': 'Target user ID is required'}), 400

    response, status = remove_friend(current_user_id, target_user_id)
    return jsonify(response), status


@jwt_required()
def add_hobby_endpoint():
    user_id = get_jwt_identity()
    data = request.get_json()
    hobby = data.get('hobby')

    if not hobby:
        return jsonify({'error': 'Hobby is required'}), 400

    response, status = add_hobby(user_id, hobby)
    return jsonify(response), status

@jwt_required()
def get_hobbies_endpoint():
    user_id = get_jwt_identity()
    response, status = get_hobbies(user_id)
    return jsonify(response), status

@jwt_required()
def delete_hobby_endpoint():
    user_id = get_jwt_identity()
    data = request.get_json()
    hobby = data.get('hobby')

    if not hobby:
        return jsonify({'error': 'Hobby is required'}), 400

    response, status = delete_hobby(user_id, hobby)
    return jsonify(response), status
