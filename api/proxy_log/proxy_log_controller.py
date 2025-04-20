from flask import Blueprint, request
from api.jwt.jwt_service import JwtService
from api.proxy.proxy_dao import ProxyDao
from api.proxy_log.proxy_log_service import ProxyLogService
from api.util import UnauthorizedError

proxy_log_bp = Blueprint('proxy_log', __name__)

@proxy_log_bp.route('/<proxy_id>/logs', methods=['GET'])
def get_all_proxy_logs_by_proxy_id(proxy_id: int):
    token = request.cookies.get('auth_token')
    jwt_payload = JwtService.decode_token(token)

    if not ProxyDao.get_proxy_by_id(proxy_id):
        raise ValueError("proxy not found")

    if ProxyDao.get_proxy_by_id(proxy_id).user_id != int(jwt_payload['sub']):
        raise UnauthorizedError('unauthorized access to this resource')

    proxy_logs = ProxyLogService.get_all_proxy_logs_by_proxy_id(proxy_id)
    proxy_logs_json = [proxy.to_dict() for proxy in proxy_logs]
    return { 'proxyLogs': proxy_logs_json }, 200

@proxy_log_bp.route('/<proxy_log_id>/analyze', methods=['POST'])
def analyze_proxy_log(proxy_log_id: int):
    token = request.cookies.get('auth_token')
    jwt_payload = JwtService.decode_token(token)

    # TODO: verify authorization

    analysis = ProxyLogService.analyze_proxy_log(proxy_log_id)
    return { 'analysis': analysis }, 201