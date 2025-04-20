from flask import Blueprint, request
from api.jwt.jwt_service import JwtService
from api.proxy.proxy_service import ProxyService
from api.util import UnauthorizedError
from api.proxy.proxy_dao import ProxyDao

proxy_bp = Blueprint('proxy', __name__)

@proxy_bp.route('/<user_id>', methods=['GET'])
def get_all_proxies_by_user_id(user_id: int):
    token = request.cookies.get('auth_token')
    jwt_payload = JwtService.decode_token(token)

    if user_id != jwt_payload['sub']:
        raise UnauthorizedError('unauthorized access to this resource')

    proxies = ProxyService.get_all_proxies_by_user_id(user_id)
    proxies_json = [proxy.to_dict() for proxy in proxies]
    return { 'proxies': proxies_json }, 200

@proxy_bp.route('/<proxy_id>/with-logs', methods=['GET'])
def get_proxy_with_logs_by_proxy_id(proxy_id: int):
    token = request.cookies.get('auth_token')
    jwt_payload = JwtService.decode_token(token)

    if not ProxyDao.get_proxy_by_id(proxy_id):
        raise ValueError("proxy not found")

    if ProxyDao.get_proxy_by_id(proxy_id).user_id != int(jwt_payload['sub']):
        raise UnauthorizedError('unauthorized access to this resource')

    proxy_with_logs = ProxyService.get_proxy_with_logs_by_proxy_id(proxy_id)
    return { 'proxy': proxy_with_logs.to_dict() }, 200

@proxy_bp.route('/', methods=['POST'])
def create_proxy():
    token = request.cookies.get('auth_token')
    jwt_payload = JwtService.decode_token(token)
    user_id = jwt_payload['sub']

    proxy_id = ProxyService.create_proxy(
        user_id,
        request.json['name'],
        request.json['cloudProvider'],
        request.json['cloudProviderRegion'],
        request.json['pricingPlan'],
        request.json['apiProtocol'],
        request.json['baseApiUrl']
    )
    return { 'proxyId': proxy_id }, 201