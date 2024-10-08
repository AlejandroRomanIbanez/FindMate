from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.post_service import create_post, get_user_posts, get_all_posts, delete_post


@jwt_required()
def create_post_endpoint():
    user_id = get_jwt_identity()
    data = request.get_json()
    content = data.get('content')
    img_url = data.get('img_url', '')

    if not content:
        return jsonify({'error': 'Content is required'}), 400

    response, status = create_post(user_id, content, img_url)
    return jsonify(response), status


@jwt_required()
def get_user_posts_endpoint(user_id):
    posts = get_user_posts(user_id)
    return jsonify(posts), 200


@jwt_required()
def get_all_posts_endpoint():
    posts = get_all_posts()
    return jsonify(posts), 200


@jwt_required()
def delete_post_endpoint(post_id):
    response, status = delete_post(post_id)
    return jsonify(response), status
