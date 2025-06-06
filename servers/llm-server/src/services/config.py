"""Configuration management for the LLM server"""

from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings"""
    
    # API Keys
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    tavily_api_key: str = ""
    github_token: str = ""
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # LiteLLM Configuration
    litellm_config_path: str = "config.yaml"
    litellm_proxy_port: int = 4000
    
    # Database (for future use)
    database_url: str = "sqlite:///./agentic_canvas.db"
    redis_url: str = "redis://localhost:6379"
    
    # Logging
    log_level: str = "INFO"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
