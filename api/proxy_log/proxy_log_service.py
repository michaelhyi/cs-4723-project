from api.proxy_log.proxy_log import ProxyLog
from api.proxy_log.proxy_log_dao import ProxyLogDao
from api.proxy.proxy_dao import ProxyDao
from api.open_ai.open_ai_service import OpenAiService

class ProxyLogService():
    @staticmethod
    def get_all_proxy_logs_by_proxy_id(proxy_id: int) -> list[ProxyLog]:
        if not proxy_id:
            raise ValueError("invalid proxy id")

        if not ProxyDao.get_proxy_by_id(proxy_id):
            raise ValueError("proxy not found")

        return ProxyLogDao.get_all_proxy_logs_by_proxy_id(proxy_id)

    @staticmethod
    def analyze_proxy_log(proxy_log_id: int) -> str:
        if not proxy_log_id:
            raise ValueError("invalid proxy log id")

        proxy_log = ProxyLogDao.get_proxy_log_by_id(proxy_log_id)
        if not proxy_log:
            raise ValueError("proxy log not found")
        
        prompt = "Given the following network request and response logs, can you help me analyze the traffic and provide me tips on debugging?" + str(proxy_log.to_dict())
        analysis = OpenAiService.create_response(prompt)
        return analysis