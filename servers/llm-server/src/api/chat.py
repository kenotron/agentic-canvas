"""OpenAI-compatible chat endpoints"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import httpx
import json
from typing import AsyncGenerator

from ..models.api import ChatCompletionRequest, ChatCompletionResponse, ErrorResponse
from ..services.config import get_settings

router = APIRouter()

@router.post("/chat/completions", response_model=ChatCompletionResponse)
async def create_chat_completion(
    request: ChatCompletionRequest,
    settings = Depends(get_settings)
):
    """
    Create a chat completion using OpenAI-compatible API.
    This endpoint proxies requests to LiteLLM for multi-provider support.
    """
    
    # Proxy to LiteLLM
    litellm_url = f"http://localhost:{settings.litellm_proxy_port}/chat/completions"
    
    async with httpx.AsyncClient() as client:
        try:
            if request.stream:
                # Handle streaming responses
                async def stream_response():
                    async with client.stream(
                        "POST",
                        litellm_url,
                        json=request.model_dump(exclude_none=True),
                        headers={"Content-Type": "application/json"}
                    ) as response:
                        async for chunk in response.aiter_text():
                            if chunk.strip():
                                yield f"data: {chunk}\n\n"
                        yield "data: [DONE]\n\n"
                
                return StreamingResponse(
                    stream_response(), 
                    media_type="text/plain",
                    headers={
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                        "Content-Type": "text/event-stream"
                    }
                )
            else:
                # Handle non-streaming responses
                response = await client.post(
                    litellm_url,
                    json=request.model_dump(exclude_none=True),
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"LiteLLM error: {response.text}"
                    )
                
                return response.json()
                
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Failed to connect to LiteLLM proxy: {str(e)}"
            )

@router.get("/models")
async def list_models(settings = Depends(get_settings)):
    """List available models"""
    
    litellm_url = f"http://localhost:{settings.litellm_proxy_port}/models"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(litellm_url)
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"LiteLLM error: {response.text}"
                )
            
            return response.json()
            
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Failed to connect to LiteLLM proxy: {str(e)}"
            )
