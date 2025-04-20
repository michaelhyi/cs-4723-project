from api.stripe.stripe_service import StripeService
from api.user.user_dao import UserDao
from api.util import valid_string

class PricingService:
    @staticmethod
    def subscribe_to_enterprise_plan(user_id: str, origin: str):
        if not valid_string(user_id):
            raise ValueError("invalid user_id")
        if not valid_string(origin):
            raise ValueError("invalid origin")

        user = UserDao.get_user_by_id(user_id)
        if not user:
            raise ValueError("user not found")

        if user.pricing_plan == "Enterprise":
            raise ValueError("user already subscribed to enterprise plan")

        # TODO: Handle the case where the user cancels the Stripe checkout.
        UserDao.update_user_pricing_plan(user_id, "Enterprise")

        success_url = f"{origin}/pricing"
        cancel_url = f"{origin}/pricing"
        session = StripeService.create_checkout_session(success_url, cancel_url)
        return session.id
