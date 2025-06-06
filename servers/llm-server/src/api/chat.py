"""OpenAI-compatible chat endpoints"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import litellm
import json
import time
from typing import AsyncGenerator, Dict, Any, Optional
import asyncio

from ..models.api import ChatCompletionRequest, ChatCompletionResponse, ErrorResponse, ResponseRequest, ResponseObject, ResponseList
from ..services.config import get_settings

router = APIRouter()

# Configure LiteLLM for direct API usage
litellm.drop_params = True  # Drop unsupported parameters instead of erroring
litellm.set_verbose = False  # Reduce logging

async def acompletion_with_fallback(**kwargs) -> Dict[str, Any]:
    """
    Async wrapper for litellm.acompletion with error handling and fallbacks
    """
    try:
        # Use litellm's async completion function
        response = await litellm.acompletion(**kwargs)
        return response
    except Exception as e:
        # Log the error and try with a fallback model if the primary fails
        print(f"LiteLLM error with model {kwargs.get('model', 'unknown')}: {str(e)}")
        
        # Try fallback models
        fallback_models = ["gpt-3.5-turbo", "claude-3-haiku-20240307"]
        original_model = kwargs.get('model')
        
        for fallback_model in fallback_models:
            if fallback_model != original_model:
                try:
                    kwargs['model'] = fallback_model
                    print(f"Trying fallback model: {fallback_model}")
                    response = await litellm.acompletion(**kwargs)
                    return response
                except Exception as fallback_error:
                    print(f"Fallback model {fallback_model} also failed: {str(fallback_error)}")
                    continue
        
        # If all models fail, raise the original error
        raise e

@router.post("/chat/completions", response_model=ChatCompletionResponse)
async def create_chat_completion(
    request: ChatCompletionRequest,
    settings = Depends(get_settings)
):
    """
    Create a chat completion using LiteLLM Python API.
    Supports multiple providers through LiteLLM's unified interface.
    """
    
    try:
        # Convert request to LiteLLM format
        litellm_params = {
            "model": request.model or "gpt-3.5-turbo",
            "messages": [msg.model_dump() for msg in request.messages],
            "temperature": getattr(request, 'temperature', None),
            "max_tokens": getattr(request, 'max_tokens', None),
            "top_p": getattr(request, 'top_p', None),
            "frequency_penalty": getattr(request, 'frequency_penalty', None),
            "presence_penalty": getattr(request, 'presence_penalty', None),
            "stream": getattr(request, 'stream', False),
        }
        
        # Remove None values
        litellm_params = {k: v for k, v in litellm_params.items() if v is not None}
        
        if request.stream:
            # Handle streaming responses
            async def stream_response():
                try:
                    response_stream = await litellm.acompletion(**litellm_params)
                    async for chunk in response_stream:
                        # LiteLLM returns chunk objects, extract the data properly
                        if hasattr(chunk, 'choices') and chunk.choices:
                            chunk_data = {
                                "id": getattr(chunk, 'id', f"chatcmpl-{int(time.time())}"),
                                "object": "chat.completion.chunk",
                                "created": getattr(chunk, 'created', int(time.time())),
                                "model": request.model,
                                "choices": [
                                    {
                                        "index": choice.index,
                                        "delta": {
                                            "role": getattr(choice.delta, 'role', None),
                                            "content": getattr(choice.delta, 'content', None)
                                        },
                                        "finish_reason": getattr(choice, 'finish_reason', None)
                                    }
                                    for choice in chunk.choices
                                ]
                            }
                            yield f"data: {json.dumps(chunk_data)}\n\n"
                    yield "data: [DONE]\n\n"
                except Exception as e:
                    error_data = {
                        "error": {
                            "message": str(e),
                            "type": "server_error"
                        }
                    }
                    yield f"data: {json.dumps(error_data)}\n\n"
            
            return StreamingResponse(
                stream_response(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "Access-Control-Allow-Origin": "*",
                }
            )
        else:
            # Handle non-streaming responses
            response = await acompletion_with_fallback(**litellm_params)
            
            # Convert response to OpenAI-compatible format
            openai_response = {
                "id": response.get("id", f"chatcmpl-{int(time.time())}"),
                "object": "chat.completion",
                "created": response.get("created", int(time.time())),
                "model": request.model,
                "choices": response.get("choices", []),
                "usage": response.get("usage", {
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0
                })
            }
            
            return openai_response
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LiteLLM completion error: {str(e)}"
        )

# In-memory storage for responses (in production, use a database)
responses_storage: Dict[str, ResponseObject] = {}

@router.post("/responses", response_model=ResponseObject)
async def create_response(
    request: ResponseRequest,
    settings = Depends(get_settings)
):
    """
    Create a response (OpenAI Responses API compatible).
    
    This endpoint stores responses for later retrieval and analysis.
    Compatible with OpenAI's Responses API specification.
    """
    
    try:
        # Generate unique ID for the response
        response_id = f"resp_{int(time.time())}_{hash(request.response) % 10000:04d}"
        current_time = int(time.time())
        
        # Create response object
        response_obj = ResponseObject(
            id=response_id,
            created=current_time,
            response=request.response,
            conversation_id=request.conversation_id,
            parent_message_id=request.parent_message_id,
            metadata=request.metadata
        )
        
        # Store response (in production, use a database)
        responses_storage[response_id] = response_obj
        
        # Log for analytics/training
        print(f"Response created: {response_obj.model_dump()}")
        
        return response_obj
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating response: {str(e)}"
        )

@router.get("/responses/{response_id}", response_model=ResponseObject)
async def get_response(
    response_id: str,
    settings = Depends(get_settings)
):
    """
    Retrieve a specific response by ID (OpenAI Responses API compatible).
    """
    
    try:
        if response_id not in responses_storage:
            raise HTTPException(
                status_code=404,
                detail=f"Response {response_id} not found"
            )
        
        return responses_storage[response_id]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving response: {str(e)}"
        )

@router.get("/responses", response_model=ResponseList)
async def list_responses(
    conversation_id: Optional[str] = None,
    limit: int = 20,
    after: Optional[str] = None,
    settings = Depends(get_settings)
):
    """
    List responses with optional filtering (OpenAI Responses API compatible).
    """
    
    try:
        # Filter responses based on parameters
        filtered_responses = list(responses_storage.values())
        
        # Filter by conversation_id if provided
        if conversation_id:
            filtered_responses = [
                r for r in filtered_responses
                if r.conversation_id == conversation_id
            ]
        
        # Sort by creation time (newest first)
        filtered_responses.sort(key=lambda r: r.created, reverse=True)
        
        # Apply pagination
        if after:
            try:
                after_index = next(
                    i for i, r in enumerate(filtered_responses)
                    if r.id == after
                )
                filtered_responses = filtered_responses[after_index + 1:]
            except StopIteration:
                # If 'after' ID not found, return empty list
                filtered_responses = []
        
        # Limit results
        has_more = len(filtered_responses) > limit
        filtered_responses = filtered_responses[:limit]
        
        return ResponseList(
            data=filtered_responses,
            has_more=has_more
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing responses: {str(e)}"
        )

@router.delete("/responses/{response_id}")
async def delete_response(
    response_id: str,
    settings = Depends(get_settings)
):
    """
    Delete a specific response by ID (OpenAI Responses API compatible).
    """
    
    try:
        if response_id not in responses_storage:
            raise HTTPException(
                status_code=404,
                detail=f"Response {response_id} not found"
            )
        
        del responses_storage[response_id]
        
        return {"deleted": True}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting response: {str(e)}"
        )

@router.get("/models")
async def list_models(settings = Depends(get_settings)):
    """List available models"""
    
    try:
        # Return a static list of commonly supported models
        # In a production environment, you might want to dynamically fetch this
        models = {
            "object": "list",
            "data": [
                {
                    "id": "gpt-4",
                    "object": "model",
                    "created": int(time.time()),
                    "owned_by": "openai"
                },
                {
                    "id": "gpt-4-turbo",
                    "object": "model",
                    "created": int(time.time()),
                    "owned_by": "openai"
                },
                {
                    "id": "gpt-3.5-turbo",
                    "object": "model",
                    "created": int(time.time()),
                    "owned_by": "openai"
                },
                {
                    "id": "claude-3-opus-20240229",
                    "object": "model",
                    "created": int(time.time()),
                    "owned_by": "anthropic"
                },
                {
                    "id": "claude-3-sonnet-20240229",
                    "object": "model",
                    "created": int(time.time()),
                    "owned_by": "anthropic"
                },
                {
                    "id": "claude-3-haiku-20240307",
                    "object": "model",
                    "created": int(time.time()),
                    "owned_by": "anthropic"
                }
            ]
        }
        
        return models
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing models: {str(e)}"
        )
