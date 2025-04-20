from api.proxy.proxy import Proxy
from api.proxy.proxy_dao import ProxyDao
from api.proxy.proxy_with_logs import ProxyWithLogs
from api.proxy_log.proxy_log_dao import ProxyLogDao
from api.user.user_dao import UserDao
from api.util import valid_string
from api.aws.aws_service import AwsService
import os

UBUNTU_X86_64_AMI_ID = "ami-04f167a56786e4b09"

class ProxyService():
    @staticmethod
    def get_all_proxies_by_user_id(user_id: int) -> list[Proxy]:
        if not user_id:
            raise ValueError("invalid user id")

        if not UserDao.get_user_by_id(user_id):
            raise ValueError("user not found")

        return ProxyDao.get_all_proxies_by_user_id(user_id)

    @staticmethod
    def get_proxy_with_logs_by_proxy_id(proxy_id: int) -> ProxyWithLogs:
        if not proxy_id:
            raise ValueError("invalid proxy id")

        proxy = ProxyDao.get_proxy_by_id(proxy_id)
        if not proxy:
            raise ValueError("proxy not found")

        logs = ProxyLogDao.get_all_proxy_logs_by_proxy_id(proxy_id)

        proxy_with_logs = ProxyWithLogs(proxy, logs)
        return proxy_with_logs

    @staticmethod
    def create_proxy(
        user_id: int,
        name: str,
        cloud_provider: str,
        cloud_region: str,
        pricing_plan: str,
        api_protocol: str,
        api_base_url: str
    ) -> int:
        if not user_id:
            raise ValueError("invalid user id")
        if not valid_string(name):
            raise ValueError("invalid name")
        if not valid_string(cloud_provider):
            raise ValueError("invalid cloud provider")
        if not valid_string(cloud_region):
            raise ValueError("invalid cloud region")
        if not valid_string(pricing_plan):
            raise ValueError("invalid pricing plan")
        if not valid_string(api_protocol):
            raise ValueError("invalid API protocol")
        if not valid_string(api_base_url):
            raise ValueError("invalid API base URL")

        if ProxyDao.get_proxy_by_name(name):
            raise ValueError("a proxy with that name already exists")

        instance = AwsService.create_instance(
            region=cloud_region,
            ami_id=UBUNTU_X86_64_AMI_ID,
            instance_type="t2.micro",
            key_name="apiveil",
            security_group_ids=[os.environ["SECURITY_GROUP_ID"]],
            subnet_id=os.environ["SUBNET_ID"]
        )

        proxy_id = ProxyDao.create_proxy(
            user_id,
            name,
            'Running',
            cloud_provider,
            cloud_region,
            pricing_plan,
            api_protocol,
            api_base_url,
            instance.public_dns_name,
            '',
            instance.id
        )

        AwsService.init_instance(instance, api_base_url, proxy_id)

        return proxy_id
