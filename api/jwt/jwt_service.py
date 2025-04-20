import jwt
import time

# TODO: change secret
class JwtService():
    @staticmethod
    def generate_token(user_id: str) -> str:
        return jwt.encode(
            { "sub": str(user_id), "iat": int(time.time()), "exp": int(time.time()) + 3600},
            "secret",
            algorithm="HS256"
        )

    @staticmethod
    def decode_token(token):
        return jwt.decode(token, "secret", algorithms=["HS256"])