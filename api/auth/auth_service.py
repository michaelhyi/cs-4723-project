from api.util import valid_string, valid_email, UnauthorizedError
from api.user.user import User
from api.user.user_dao import UserDao 
from api.hash.hash_service import HashService
from api.jwt.jwt_service import JwtService

class AuthService():
    @staticmethod
    def login(email: str, password: str) -> tuple[str, str]:
        if not valid_string(email) or not valid_email(email):
            raise ValueError("invalid email")
        if not valid_string(password):
            raise ValueError("invalid password")

        user = UserDao.get_user_by_email(email) 
        if user is None:
            raise ValueError("user not found")

        if not HashService.compare(password, user.password):
            raise ValueError("password is incorrect")

        return user.user_id, JwtService.generate_token(user.user_id)

    @staticmethod
    def register(name: str, email: str, password: str, confirm_passord: str) -> tuple[str, str]:
        if not valid_string(name):
            raise ValueError("invalid name")
        if not valid_string(email) or not valid_email(email):
            raise ValueError("invalid email")
        if not valid_string(password):
            raise ValueError("invalid password")
        if not valid_string(confirm_passord):
            raise ValueError("invalid confirm password")
        if password != confirm_passord:
            raise ValueError("passwords do not match")

        user = UserDao.get_user_by_email(email) 
        if user:
            raise ValueError("user already exists")

        hashed_password = HashService.hash(password)
        user_id = UserDao.create_user(name, email, hashed_password, 'PASSWORD')
        return user_id, JwtService.generate_token(user_id)

    @staticmethod
    def get_me(token: str) -> User:
        if not valid_string(token):
            raise ValueError("invalid token")

        try:
            decoded_token = JwtService.decode_token(token)
            user_id = decoded_token['sub']
            return UserDao.get_user_by_id(user_id)
        except Exception as e:
            raise UnauthorizedError("invalid token")