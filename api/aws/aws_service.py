import boto3
import time
import paramiko
import os

class AwsService:
    @staticmethod
    def create_instance(region: str, ami_id: str, instance_type: str, key_name: str, security_group_ids: str, subnet_id: str):
        ec2_resource = boto3.resource("ec2", region_name=region)

        response = ec2_resource.create_instances(
            ImageId=ami_id,
            InstanceType=instance_type,
            KeyName=key_name,
            SecurityGroupIds=security_group_ids,
            SubnetId=subnet_id,
            MinCount=1,
            MaxCount=1
        )
        instance = response[0]

        instance.wait_until_running()
        instance.load()

        return instance

    @staticmethod
    def init_instance(instance, base_api_host: str, proxy_id: int):
        time.sleep(180)

        api_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        key_path = os.path.join(api_dir, "apiveil.pem")
        key = paramiko.RSAKey.from_private_key_file(key_path)
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        ssh.connect(hostname=instance.public_ip_address, username="ubuntu", pkey=key)
        
        stdin, stdout, stderr = ssh.exec_command("sudo apt-get update")
        stdout.read()
        
        stdin, stdout, stderr = ssh.exec_command("sudo apt-get install -y docker.io")
        stdout.read()

        stdin, stdout, stderr = ssh.exec_command("sudo systemctl start docker && sudo systemctl enable docker")
        stdout.read()
        
        stdin, stdout, stderr = ssh.exec_command("sudo usermod -aG docker ubuntu")
        stdout.read()
        
        # Ensure Docker starts on boot
        stdin, stdout, stderr = ssh.exec_command("sudo systemctl enable docker")
        stdout.read()
    
        ssh.close()
        time.sleep(5)
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=instance.public_ip_address, username="ubuntu", pkey=key)
        
        stdin, stdout, stderr = ssh.exec_command("docker pull michaelyi/apiveil:amd64")
        stdout.read()

        docker_cmd = f"""
        docker run -d \\
          -p 80:4000 \\
          -e DB_HOST={os.environ["DB_HOST"]} \\
          -e DB_NAME=apiveil \\
          -e DB_USER=postgres \\
          -e DB_PASSWORD={os.environ["DB_PASSWORD"]} \\
          -e BASE_API_HOST={base_api_host} \\
          -e PROXY_ID={proxy_id} \\
          michaelyi/apiveil:amd64
        """

        stdin, stdout, stderr = ssh.exec_command(docker_cmd)
        stdout.read()
        
        ssh.close()