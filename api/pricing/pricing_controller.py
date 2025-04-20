from flask import Blueprint, request
from api.pricing.pricing_service import PricingService
from api.auth.auth_service import JwtService

pricing_bp = Blueprint('pricing', __name__)

@pricing_bp.route('/<user_id>/subscribe/enterprise', methods=['POST'])
def subscribe_to_enterprise_plan(user_id: str):
    token = request.cookies.get('auth_token')
    JwtService.decode_token(token)

    session_id = PricingService.subscribe_to_enterprise_plan(user_id, request.environ.get('HTTP_ORIGIN'))
    return { "sessionId": session_id }, 201