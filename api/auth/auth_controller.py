from flask import Blueprint, request, make_response
from api.auth.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)

# TODO: enable secure flag for production
@auth_bp.route('/login', methods=['POST'])
def login():
    login_response = AuthService.login(request.json['email'], request.json['password'])
    http_response = make_response({"userId": login_response[0]}, 200)
    http_response.set_cookie('auth_token', login_response[1], httponly=True, max_age=3600, samesite='Lax', secure=False, domain="localhost")
    return http_response

@auth_bp.route('/register', methods=['POST'])
def register():
    register_response = AuthService.register(
        request.json['name'],
        request.json['email'],
        request.json['password'],
        request.json['confirmPassword']
    )
    http_response = make_response({"userId": register_response[0]}, 201)
    http_response.set_cookie('auth_token', register_response[1], httponly=True, max_age=3600, samesite='Lax', secure=False, domain="localhost")
    return http_response

@auth_bp.route('/me', methods=['GET'])
def get_me():
    token = request.cookies.get('auth_token')
    user = AuthService.get_me(token)
    user_json = user.to_dict()
    del user_json['password']
    return {'user': user_json}, 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    http_response = make_response('', 204)
    http_response.delete_cookie('auth_token')
    return http_response