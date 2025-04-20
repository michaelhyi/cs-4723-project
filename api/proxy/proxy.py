import datetime

class Proxy:
    def __init__(
        self,
        proxy_id: int,
        user_id: int,
        name: str,
        cloud_provider: str,
        cloud_region: str,
        pricing_plan: str,
        api_protocol: str,
        api_base_url: str,
        ip_address: str,
        server_id: str,
        created_at: datetime,
        updated_at: datetime,
        proxy_url: str,
        status: str,
    ):
        self.proxy_id = proxy_id
        self.user_id = user_id
        self.name = name
        self.cloud_provider = cloud_provider
        self.cloud_region = cloud_region
        self.pricing_plan = pricing_plan
        self.api_protocol = api_protocol
        self.api_base_url = api_base_url
        self.proxy_url = proxy_url
        self.ip_address = ip_address
        self.server_id = server_id
        self.created_at = created_at
        self.updated_at = updated_at
        self.status = status

    def to_dict(self) -> dict:
        return {
            "proxyId": self.proxy_id,
            "userId": self.user_id,
            "name": self.name,
            "status": self.status,
            "cloudProvider": self.cloud_provider,
            "cloudRegion": self.cloud_region,
            "pricingPlan": self.pricing_plan,
            "apiProtocol": self.api_protocol,
            "apiBaseUrl": self.api_base_url,
            "proxyUrl": self.proxy_url,
            "ipAddress": self.ip_address,
            "serverId": self.server_id,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }