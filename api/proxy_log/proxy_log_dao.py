import psycopg2
from api.proxy_log.proxy_log import ProxyLog
import os

connection = psycopg2.connect(
    host=os.environ["DB_HOST"],
    database="apiveil",
    user="postgres",
    password=os.environ["DB_PASSWORD"]
)

class ProxyLogDao():
    @staticmethod
    def get_all_proxy_logs_by_proxy_id(proxy_id: int) -> list[ProxyLog]:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM public.proxy_log WHERE proxy_id = %s", (proxy_id,))
            result_set = cursor.fetchall()

            if not result_set:
                return []

            return [ProxyLog(*result) for result in result_set]

    @staticmethod
    def get_proxy_log_by_id(proxy_log_id: int) -> ProxyLog:
        if not proxy_log_id:
            raise ValueError("invalid proxy log id")

        with connection.cursor() as cursor: 
            cursor.execute("SELECT * FROM public.proxy_log WHERE proxy_log_id = %s", (proxy_log_id,))
            result_set = cursor.fetchone()

            if not result_set:
                raise None

            return ProxyLog(*result_set)