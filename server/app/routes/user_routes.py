from flask import Blueprint
from app.controllers.user_controller import edit_user, fetch_all_users, fetch_user_by_username, add_friend_endpoint \
    , remove_friend_endpoint, fetch_current_user, add_hobby_endpoint, get_hobbies_endpoint, delete_hobby_endpoint, \
    buy_sub_endpoint, cancel_subscription_endpoint

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

user_bp.route('/me', methods=['GET'])(fetch_current_user)
user_bp.route('/all', methods=['GET'])(fetch_all_users)
user_bp.route('/edit', methods=['PUT'])(edit_user)
user_bp.route('/<username>', methods=['GET'])(fetch_user_by_username)
user_bp.route('/add_friend', methods=['POST'])(add_friend_endpoint)
user_bp.route('/remove_friend', methods=['POST'])(remove_friend_endpoint)
user_bp.route('/hobbies', methods=['POST'])(add_hobby_endpoint)
user_bp.route('/hobbies', methods=['GET'])(get_hobbies_endpoint)
user_bp.route('/hobbies', methods=['DELETE'])(delete_hobby_endpoint)
user_bp.route('/buy_sub', methods=['POST'])(buy_sub_endpoint)
user_bp.route('/cancel_sub', methods=['POST'])(cancel_subscription_endpoint)
