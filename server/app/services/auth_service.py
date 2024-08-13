from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo
from app.utils.custom_errors import UserAlreadyExistsError, UserNotFoundError, IncorrectPasswordError


def calculate_age(born):
    today = datetime.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))


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
    date_of_birth = data.date_of_birth
    age = calculate_age(date_of_birth)

    if mongo.social.users.find_one({'username': username}):
        raise UserAlreadyExistsError()

    mongo.social.users.insert_one({
        'avatar_url': '',
        'email': email,
        'username': username,
        'password': password,
        'date_of_birth': date_of_birth.isoformat(),
        'isPaid': False,
        'bio': '',
        'friends': {'followers': [], 'following': []},
        'posts': [],
        'age': age
    })
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

    user = mongo.social.users.find_one({'email': email})
    if not user:
        raise UserNotFoundError()
    if not check_password_hash(user['password'], password):
        raise IncorrectPasswordError()

    return user
