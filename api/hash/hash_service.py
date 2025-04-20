import bcrypt
import base64
import hashlib

class HashService():
    @staticmethod
    def compare(password, hashed) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

    @staticmethod
    def hash(password) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')