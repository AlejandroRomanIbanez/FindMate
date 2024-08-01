from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
mongo = MongoClient(mongo_uri)


def create_app():
    """
    Creates and configures the Flask application.

    This function initializes the Flask app with necessary configurations, including
    enabling CORS, setting up JWT authentication, and registering blueprints for routes.

    Returns:
        Flask: The configured Flask application.
    """
    app = Flask(__name__)
    CORS(app)

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=4)
    jwt = JWTManager(app)

    jwt.init_app(app)

    return app
