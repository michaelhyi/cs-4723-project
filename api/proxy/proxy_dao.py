import psycopg2
from api.proxy.proxy import Proxy
from api.proxy.proxy_with_logs import ProxyWithLogs
import os

connection = psycopg2.connect(
    host=os.environ["DB_HOST"],
    database="apiveil",
    user="postgres",
    password=os.environ["DB_PASSWORD"]
)

class ProxyDao():
    @staticmethod
    def get_proxy_by_id(proxy_id: int) -> Proxy | None:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM public.proxy WHERE proxy_id = %s", (proxy_id,))
            result_set = cursor.fetchone()

            if result_set is None:
                return None

            return Proxy(*result_set)

    @staticmethod
    def get_all_proxies_by_user_id(user_id: int) -> list[Proxy]:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM public.proxy WHERE user_id = %s", (user_id,))
            result_set = cursor.fetchall()

            if not result_set:
                return []

            return [Proxy(*result) for result in result_set]

    @staticmethod
    def get_proxy_by_name(name: str) -> Proxy | None:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM public.proxy WHERE name = %s", (name,))
            result_set = cursor.fetchone()

            if result_set is None:
                return None

            return Proxy(*result_set)

    @staticmethod
    def create_proxy(
        user_id: int,
        name: str,
        status: str,
        cloud_provider: str,
        cloud_region: str,
        pricing_plan: str,
        api_protocol: str,
        api_base_url: str,
        proxy_url: str,
        ip_address: str,
        server_id: str
    ) -> int:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO public.proxy (user_id, name, status, cloud_provider, cloud_region, pricing_plan, api_protocol, api_base_url, proxy_url, ip_address, server_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING proxy_id", 
                (user_id, name, status, cloud_provider, cloud_region, pricing_plan, api_protocol, api_base_url, proxy_url, ip_address, server_id)
            )
            proxy_id = cursor.fetchone()[0]
            connection.commit()
            return proxy_id