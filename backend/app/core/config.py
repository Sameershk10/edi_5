import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Based Autonomous Voice Calling Agent"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Institution / Academic Metadata
    INSTITUTION: str = "Vishwakarma Institute of Technology, Pune"
    DEPARTMENT: str = "Department of Artificial Intelligence & Data Science"
    ACADEMIC_YEAR: str = "2025-26"
    PROJECT_GROUP: str = "TY_E_13"
    GUIDE_NAME: str = "Dr. Viomesh Kumar Singh"
    
    # Secrets & API Keys
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "vit-pune-voiceagent-secure-secret-key-semester-5")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # Telephony
    TWILIO_ACCOUNT_SID: Optional[str] = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: Optional[str] = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: Optional[str] = os.getenv("TWILIO_PHONE_NUMBER", "+15551234567")
    
    # Databases & Queues
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./voiceagent.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    RABBITMQ_URL: str = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
    
    # Operational Mode
    MOCK_MODE: bool = os.getenv("MOCK_MODE", "true").lower() in ("true", "1", "yes")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
