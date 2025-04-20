import re

class UnauthorizedError(Exception):
    pass

def valid_string(str: str) -> bool:
    return str and len(str) > 0 and not str.isspace()

def valid_email(email: str) -> bool:
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None