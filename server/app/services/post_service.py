from app import mongo
from bson import ObjectId
from app.helpers import serialize_object_id


def create_post(author_id, content, img_url):
    post = {
        'content': content,
        'author': ObjectId(author_id),
        'img_url': img_url
    }
    result = mongo.dbs.posts.insert_one(post)
    post_id = result.inserted_id

    mongo.dbs.users.update_one(
        {'_id': ObjectId(author_id)},
        {'$push': {'posts': str(post_id)}}
    )
    return {'post_id': str(post_id)}, 201


def get_user_posts(user_id):
    posts = mongo.dbs.posts.find({'author': ObjectId(user_id)})
    posts_serialized = [serialize_object_id(post) for post in posts]
    return posts_serialized


def get_all_posts():
    posts = mongo.dbs.posts.find()
    posts_serialized = [serialize_object_id(post) for post in posts]
    return posts_serialized


def delete_post(post_id):
    result = mongo.dbs.posts.delete_one({'_id': ObjectId(post_id)})
    if result.deleted_count == 0:
        return {'error': 'Post not found'}, 404

    mongo.dbs.users.update_one(
        {'posts': str(post_id)},
        {'$pull': {'posts': str(post_id)}}
    )
    return {'message': 'Post deleted successfully'}, 200
