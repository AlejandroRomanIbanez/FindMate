from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo


def register_user(data):
    """
    Register a new user in the database.

    Hashes the user's password and stores the user information in the database.
    Checks if the username already exists.

    Args:
        data (UserRegistration): User registration data.

    Returns:
        tuple: JSON response message and HTTP status code.
    """
    username = data.username
    email = data.email
    password = generate_password_hash(data.password)
    age = data.age
    bio = data.bio

    if mongo.dbs.users.find_one({'username': username}):
        return {'error': 'Username already exists'}, 400

    mongo.dbs.users.insert_one({'avatar_url': '',
                               'email': email,
                               'username': username,
                               'password': password,
                               'age': age,
                               'bio': bio,
                               'isPaid': False,
                               'friends': {'followers': [], 'following': []},
                               'posts': []})
    return {'message': 'User registered successfully'}, 201


def login_user(data):
    """
    Authenticate a user.

    Verifies the user's email and password against the database records.

    Args:
        data (UserLogin): User login data.

    Returns:
        dict: User data if authentication is successful, otherwise an error message.
    """
    email = data.email
    password = data.password

    user = mongo.dbs.users.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return {'error': 'Invalid username or password'}, 401

    return user
