import os

import botocore
from dotenv import load_dotenv

from app import mongo
from bson import ObjectId
from app.helpers import serialize_object_id
import mimetypes
import boto3
from botocore.exceptions import NoCredentialsError

load_dotenv()

DO_ACCESS_KEY = os.getenv("DO_ACCESS_KEY")
DO_SECRET_KEY = os.getenv("DO_SECRET_KEY")
REGION = os.getenv("REGION")
SPACE_NAME = os.getenv("SPACE_NAME")

print("DO_ACCESS_KEY:", DO_ACCESS_KEY)
print("DO_SECRET_KEY:", DO_SECRET_KEY)
print("REGION:", REGION)
print("SPACE_NAME:", SPACE_NAME)

# Create an S3 client
s3 = boto3.client('s3',
                  region_name=REGION,
                  endpoint_url=f'https://{REGION}.digitaloceanspaces.com',
                  aws_access_key_id=DO_ACCESS_KEY,
                  aws_secret_access_key=DO_SECRET_KEY)


def upload_to_space(file, file_name):
    try:
        content_type, _ = mimetypes.guess_type(file_name)
        if not content_type:
            content_type = 'application/octet-stream'

        s3.upload_fileobj(
            Fileobj=file,
            Bucket=SPACE_NAME,
            Key=file_name,
            ExtraArgs={
                'ACL': 'public-read',
                'ContentType': content_type
            }
        )

        file_url = f"https://{SPACE_NAME}.{REGION}.digitaloceanspaces.com/{file_name}"
        return file_url
    except NoCredentialsError:
        return None


def create_post(author_id, content, img_url):
    post = {
        'content': content,
        'author': author_id,
        'img_url': img_url
    }
    result = mongo.social.posts.insert_one(post)
    post_id = result.inserted_id

    mongo.social.users.update_one(
        {'_id': ObjectId(author_id)},
        {'$push': {'posts': str(post_id)}}
    )
    return {'post_id': str(post_id)}, 201


def get_user_posts(user_id):
    posts = mongo.social.posts.find({'author': user_id})
    posts_serialized = [serialize_object_id(post) for post in posts]
    return posts_serialized


def get_all_posts():
    posts = mongo.social.posts.find().sort('_id', -1)
    posts_serialized = [serialize_object_id(post) for post in posts]
    return posts_serialized


def delete_from_space(file_name):
    try:
        s3.delete_object(Bucket=SPACE_NAME, Key=file_name)
        return True
    except NoCredentialsError:
        return False
    except botocore.exceptions.ClientError as e:
        print(f"An error occurred: {e}")
        return False



def delete_post(post_id):
    post = mongo.social.posts.find_one({'_id': ObjectId(post_id)})
    if not post:
        return {'error': 'Post not found'}, 404

    img_url = post.get('img_url')
    if img_url:
        file_name = img_url.split('/')[-1]
        full_file_name = f'social/posts/{file_name}'
        delete_from_space(full_file_name)

    result = mongo.social.posts.delete_one({'_id': ObjectId(post_id)})
    if result.deleted_count == 0:
        return {'error': 'Post not found'}, 404

    mongo.social.users.update_one(
        {'posts': str(post_id)},
        {'$pull': {'posts': str(post_id)}}
    )
    return {'message': 'Post deleted successfully'}, 200
