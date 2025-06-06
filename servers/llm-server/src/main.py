"""
Agentic Canvas LLM Server

A production-ready LLM server with OpenAI API compatibility and advanced agent capabilities.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from .api.chat import router as chat_router
from .api.agents import router as agents_router
from .api.tools import router as tools_router
from .services.config import get_settings

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Agentic Canvas LLM Server...")
    yield
    # Shutdown
    print("🛑 Shutting down Agentic Canvas LLM Server...")

def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""
    settings = get_settings()
    
    app = FastAPI(
        title="Agentic Canvas LLM Server",
        description="OpenAI-compatible LLM server with advanced agent capabilities",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(chat_router, prefix="/v1", tags=["chat"])
    app.include_router(agents_router, prefix="/agents", tags=["agents"])
    app.include_router(tools_router, prefix="/tools", tags=["tools"])
    
    @app.get("/")
    async def root():
        return {
            "message": "Agentic Canvas LLM Server",
            "version": "0.1.0",
            "docs": "/docs"
        }
    
    @app.get("/health")
    async def health():
        return {"status": "healthy"}
    
    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
