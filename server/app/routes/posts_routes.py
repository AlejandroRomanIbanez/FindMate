from flask import Blueprint
from app.controllers.post_controller import create_post_endpoint, get_user_posts_endpoint, get_all_posts_endpoint, delete_post_endpoint

post_bp = Blueprint('post', __name__, url_prefix='/api/post')

post_bp.route('/create', methods=['POST'])(create_post_endpoint)
post_bp.route('/user/<user_id>', methods=['GET'])(get_user_posts_endpoint)
post_bp.route('/all', methods=['GET'])(get_all_posts_endpoint)
post_bp.route('/<post_id>', methods=['DELETE'])(delete_post_endpoint)
