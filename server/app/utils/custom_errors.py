class UserAlreadyExistsError(Exception):
    def __init__(self, message="Username already exists"):
        self.message = message
        super().__init__(self.message)


class UserNotFoundError(Exception):
    def __init__(self, message="User not found"):
        self.message = message
        super().__init__(self.message)


class IncorrectPasswordError(Exception):
    def __init__(self, message="Incorrect password"):
        self.message = message
        super().__init__(self.message)
