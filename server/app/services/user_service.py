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
    users = mongo.dbs.users.find()
    users_serialized = serialize_object_id(users)
    return list(users_serialized)


def get_user_by_id(user_id):
    user = mongo.dbs.users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return {'error': 'User not found'}, 404
    user_serialized = serialize_object_id(user)
    return user_serialized, 200


def get_user_by_username(username):
    user = mongo.dbs.users.find_one({'username': username})
    if not user:
        return {'error': 'User not found'}, 404
    user_serialized = serialize_object_id(user)
    return user_serialized, 200


def update_user(user_id, data):
    update_fields = {}
    if data.username:
        if mongo.dbs.users.find_one({'username': data.username, '_id': {'$ne': ObjectId(user_id)}}):
            return {'error': 'Username already exists'}, 400
        update_fields['username'] = data.username

    if data.email:
        if mongo.dbs.users.find_one({'email': data.email, '_id': {'$ne': ObjectId(user_id)}}):
            return {'error': 'Email already exists'}, 400
        update_fields['email'] = data.email

    if data.password:
        update_fields['password'] = generate_password_hash(data.password)

    if data.age:
        update_fields['age'] = data.age

    if data.bio:
        update_fields['bio'] = data.bio

    if data.avatar_url:
        update_fields['avatar_url'] = data.avatar_url

    result = mongo.dbs.users.update_one({'_id': ObjectId(user_id)}, {'$set': update_fields})
    if result.matched_count == 0:
        return {'error': 'User not found'}, 404

    return {'message': 'User updated successfully'}, 200


def add_friend(current_user_id, target_user_id):
    current_user = mongo.dbs.users.find_one({'_id': ObjectId(current_user_id)})
    target_user = mongo.dbs.users.find_one({'_id': ObjectId(target_user_id)})

    if not current_user or not target_user:
        return {'error': 'User not found'}, 404

    if target_user_id in current_user['friends']['following']:
        return {'error': 'Already following this user'}, 400

    mongo.dbs.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$push': {'friends.following': target_user_id}}
    )

    mongo.dbs.users.update_one(
        {'_id': ObjectId(target_user_id)},
        {'$push': {'friends.followers': current_user_id}}
    )

    return {'message': 'Friend added successfully'}, 200


def remove_friend(current_user_id, target_user_id):
    current_user = mongo.dbs.users.find_one({'_id': ObjectId(current_user_id)})
    target_user = mongo.dbs.users.find_one({'_id': ObjectId(target_user_id)})

    if not current_user or not target_user:
        return {'error': 'User not found'}, 404

    if target_user_id not in current_user['friends']['following']:
        return {'error': 'Not following this user'}, 400

    mongo.dbs.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$pull': {'friends.following': target_user_id}}
    )

    mongo.dbs.users.update_one(
        {'_id': ObjectId(target_user_id)},
        {'$pull': {'friends.followers': current_user_id}}
    )

    return {'message': 'Friend removed successfully'}, 200


def add_hobby(user_id, hobby):
    result = mongo.dbs.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$addToSet': {'hobbies': hobby}}
    )
    if result.modified_count == 0:
        return {'error': 'Failed to add hobby'}, 400
    return {'message': 'Hobby added successfully'}, 200


def get_hobbies(user_id):
    user = mongo.dbs.users.find_one({'_id': ObjectId(user_id)}, {'hobbies': 1})
    if not user:
        return {'error': 'User not found'}, 404
    return {'hobbies': user.get('hobbies', [])}, 200


def delete_hobby(user_id, hobby):
    result = mongo.dbs.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$pull': {'hobbies': hobby}}
    )
    if result.modified_count == 0:
        return {'error': 'Failed to delete hobby'}, 400
    return {'message': 'Hobby deleted successfully'}, 200