import datetime

class User():
    def __init__(self, user_id: int, name: str, email: str, password: str, provider: str, role: str, is_active: bool, created_at: datetime, updated_at: datetime, pricing_plan: str):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.password = password
        self.provider = provider
        self.role = role
        self.is_active = is_active
        self.created_at = created_at
        self.updated_at = updated_at
        self.pricing_plan = pricing_plan

    def to_dict(self) -> dict:
        return {
            "userId": self.user_id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "provider": self.provider,
            "role": self.role,
            "isActive": self.is_active,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "pricingPlan": self.pricing_plan
        }