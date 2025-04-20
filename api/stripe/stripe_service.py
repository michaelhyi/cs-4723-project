import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
PRICE_ID = os.getenv("STRIPE_PRICE_ID")

class StripeService:
    @staticmethod
    def create_checkout_session(success_url: str, cancel_url: str):
        session = stripe.checkout.Session.create(
            submit_type='subscribe',
            mode='subscription',
            payment_method_types=['card'],
            line_items=[
                {
                    'price': PRICE_ID,
                    'quantity': 1,
                },
            ],
            success_url=success_url,
            cancel_url=cancel_url,
        )

        return session
        