from .. import create_app
from . import custom_errors
from flask import jsonify
from pydantic import ValidationError
app = create_app()


@app.errorhandler(custom_errors.UserAlreadyExistsError)
def handle_user_already_exists_error(error):
    response = jsonify({'error': error.message})
    response.status_code = 400
    return response


@app.errorhandler(custom_errors.UserNotFoundError)
def handle_user_not_found_error(error):
    response = jsonify({'error': error.message})
    response.status_code = 404
    return response


@app.errorhandler(custom_errors.IncorrectPasswordError)
def handle_incorrect_password_error(error):
    response = jsonify({'error': error.message})
    response.status_code = 401
    return response


@app.errorhandler(ValueError)
def handle_value_error(error):
    response = jsonify({'error': str(error)})
    response.status_code = 400
    return response


@app.errorhandler(TypeError)
def handle_type_error(error):
    response = jsonify({'error': str(error)})
    response.status_code = 400
    return response


@app.errorhandler(ValidationError)
def handle_validation_error(error):
    errors = error.errors()
    response = jsonify({'errors': errors})
    response.status_code = 422
    return response