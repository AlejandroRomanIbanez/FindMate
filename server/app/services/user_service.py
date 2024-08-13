from datetime import datetime, timezone, timedelta

from werkzeug.security import generate_password_hash
from app import mongo
from bson import ObjectId

from app.helpers import serialize_object_id


def get_all_users():
    """
    Fetch all users from the database.

    Returns:
        list: A list of user dictionaries.
    """
    users = mongo.social.users.find()
    users_serialized = serialize_object_id(users)
    return list(users_serialized)


def get_user_by_id(user_id):
    user = mongo.social.users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return {'error': 'User not found'}, 404
    user_serialized = serialize_object_id(user)
    return user_serialized, 200


def get_user_by_username(username):
    user = mongo.social.users.find_one({'username': username})
    if not user:
        return {'error': 'User not found'}, 404
    user_serialized = serialize_object_id(user)
    return user_serialized, 200


def update_user(user_id, data):
    update_fields = {}
    if data.username:
        if mongo.social.users.find_one({'username': data.username, '_id': {'$ne': ObjectId(user_id)}}):
            return {'error': 'Username already exists'}, 400
        update_fields['username'] = data.username

    if data.email:
        if mongo.social.users.find_one({'email': data.email, '_id': {'$ne': ObjectId(user_id)}}):
            return {'error': 'Email already exists'}, 400
        update_fields['email'] = data.email

    if data.password:
        update_fields['password'] = generate_password_hash(data.password)

    if data.age:
        update_fields['age'] = data.age

    if data.avatar_url:
        update_fields['avatar_url'] = data.avatar_url

    result = mongo.social.users.update_one({'_id': ObjectId(user_id)}, {'$set': update_fields})
    if result.matched_count == 0:
        return {'error': 'User not found'}, 404

    return {'message': 'User updated successfully'}, 200


def add_friend(current_user_id, target_user_id):
    current_user = mongo.social.users.find_one({'_id': ObjectId(current_user_id)})
    target_user = mongo.social.users.find_one({'_id': ObjectId(target_user_id)})

    if not current_user or not target_user:
        return {'error': 'User not found'}, 404

    if target_user_id in current_user['friends']['following']:
        return {'error': 'Already following this user'}, 400

    mongo.social.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$push': {'friends.following': target_user_id}}
    )

    mongo.social.users.update_one(
        {'_id': ObjectId(target_user_id)},
        {'$push': {'friends.followers': current_user_id}}
    )

    return {'message': 'Friend added successfully'}, 200


def remove_friend(current_user_id, target_user_id):
    current_user = mongo.social.users.find_one({'_id': ObjectId(current_user_id)})
    target_user = mongo.social.users.find_one({'_id': ObjectId(target_user_id)})

    if not current_user or not target_user:
        return {'error': 'User not found'}, 404

    if target_user_id not in current_user['friends']['following']:
        return {'error': 'Not following this user'}, 400

    mongo.social.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$pull': {'friends.following': target_user_id}}
    )

    mongo.social.users.update_one(
        {'_id': ObjectId(target_user_id)},
        {'$pull': {'friends.followers': current_user_id}}
    )

    return {'message': 'Friend removed successfully'}, 200


def add_hobby(user_id, hobby):
    result = mongo.social.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$addToSet': {'hobbies': hobby}}
    )
    if result.modified_count == 0:
        return {'error': 'Failed to add hobby'}, 400
    return {'message': 'Hobby added successfully'}, 200


def get_hobbies(user_id):
    user = mongo.social.users.find_one({'_id': ObjectId(user_id)}, {'hobbies': 1})
    if not user:
        return {'error': 'User not found'}, 404
    return {'hobbies': user.get('hobbies', [])}, 200


def delete_hobby(user_id, hobby):
    result = mongo.social.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$pull': {'hobbies': hobby}}
    )
    if result.modified_count == 0:
        return {'error': 'Failed to delete hobby'}, 400
    return {'message': 'Hobby deleted successfully'}, 200


def buy_sub(user_id):
    subscription_duration = 30  # days
    subscription_start = datetime.now(timezone.utc)
    subscription_end = subscription_start + timedelta(days=subscription_duration)

    result = mongo.social.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {
            'isPaid': True,
            'subscription_start_date': subscription_start,
            'subscription_end_date': subscription_end
        }}
    )

    if result.matched_count == 0:
        return {'error': 'User not found'}, 404

    return {'message': 'Subscription purchased successfully'}, 200


def calculate_refund(subscription_start, subscription_end, total_amount):
    now = datetime.now(timezone.utc)

    if now >= subscription_end:
        return 0.0

    remaining_duration = (subscription_end - now).total_seconds()
    total_duration = (subscription_end - subscription_start).total_seconds()

    if total_duration <= 0:
        return 0.0

    refund_amount = total_amount * (remaining_duration / total_duration)
    return round(refund_amount, 2)


def cancel_subscription(user_id):
    user = mongo.social.users.find_one({'_id': ObjectId(user_id)})
    if not user or not user.get('isPaid', False):
        return {'error': 'No active subscription found'}, 404

    subscription_start = user['subscription_start_date']
    subscription_end = user['subscription_end_date']


    if subscription_start.tzinfo is None:
        subscription_start = subscription_start.replace(tzinfo=timezone.utc)
    if subscription_end.tzinfo is None:
        subscription_end = subscription_end.replace(tzinfo=timezone.utc)

    total_amount = 9.99

    refund_amount = calculate_refund(subscription_start, subscription_end, total_amount)

    result = mongo.social.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {
            'isPaid': False,
            'subscription_end_date': None,
            'subscription_start_date': None
        }}
    )

    if result.matched_count == 0:
        return {'error': 'Failed to update user subscription status'}, 500

    return {'message': 'Subscription cancelled successfully', 'refund_amount': refund_amount}, 200
