from api.proxy.proxy import Proxy
from api.proxy_log.proxy_log import ProxyLog

class ProxyWithLogs(Proxy):
    def __init__(self, proxy: Proxy, logs: list[ProxyLog]):
        super().__init__(
            proxy.proxy_id,
            proxy.user_id,
            proxy.name,
            proxy.cloud_provider,
            proxy.cloud_region,
            proxy.pricing_plan,
            proxy.api_protocol,
            proxy.api_base_url,
            '',
            proxy.server_id,
            proxy.created_at,
            proxy.updated_at,
            proxy.proxy_url,
            proxy.status
        )
        self.logs = logs

    def to_dict(self):
        proxy_dict = super().to_dict()
        proxy_dict['logs'] = [log.to_dict() for log in self.logs]
        return proxy_dict