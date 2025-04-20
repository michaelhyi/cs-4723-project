import psycopg2
from api.user.user import User
import os

connection = psycopg2.connect(
    host=os.environ["DB_HOST"],
    database="apiveil",
    user="postgres",
    password=os.environ["DB_PASSWORD"]
)

class UserDao():
    @staticmethod
    def get_user_by_id(user_id: int) -> User | None:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM public.user WHERE user_id = %s", (user_id,))
            result_user = cursor.fetchone()

            if result_user is None:
                return None

            return User(*result_user)

    @staticmethod
    def get_user_by_email(email: str) -> User | None:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM public.user WHERE email = %s", (email,))
            result_user = cursor.fetchone()

            if result_user is None:
                return None

            return User(*result_user)

    @staticmethod
    def create_user(name: str, email: str, password: str, provider: str):
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO public.user (name, email, password, provider) VALUES (%s, %s, %s, %s) RETURNING user_id",
                (name, email, password, provider)
            )
            user_id = cursor.fetchone()[0]
            connection.commit()
            return user_id

    @staticmethod
    def update_user_pricing_plan(user_id: int, pricing_plan: str):
        with connection.cursor() as cursor:
            cursor.execute("UPDATE public.user SET pricing_plan = %s WHERE user_id = %s", (pricing_plan, user_id))
            connection.commit()