"""Agent API endpoints"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List

from ..models.api import AgentChatRequest, AgentChatResponse, ErrorResponse
from ..services.config import get_settings
from ..agents.main_agent import agent_service

router = APIRouter()

@router.post("/chat", response_model=AgentChatResponse)
async def agent_chat(
    request: AgentChatRequest,
    settings = Depends(get_settings)
):
    """
    Enhanced chat endpoint with agent capabilities and tool usage.
    
    This endpoint provides more advanced features than the basic OpenAI-compatible
    chat endpoint, including tool usage, context management, and agent workflows.
    """
    
    try:
        # Convert request to the format expected by the agent
        messages = [msg.model_dump() for msg in request.messages]
        
        # Process through the agent
        result = await agent_service.chat(
            messages=messages,
            conversation_id=request.conversation_id,
            user_context=request.user_context
        )
        
        # Create response in OpenAI-compatible format
        response_message = {
            "role": "assistant",
            "content": result["content"]
        }
        
        choice = {
            "index": 0,
            "message": response_message,
            "finish_reason": "stop"
        }
        
        # Mock usage (in a real implementation, you'd track actual token usage)
        usage = {
            "prompt_tokens": sum(len(msg.content.split()) for msg in request.messages),
            "completion_tokens": len(result["content"].split()),
            "total_tokens": 0
        }
        usage["total_tokens"] = usage["prompt_tokens"] + usage["completion_tokens"]
        
        response = AgentChatResponse(
            id=f"agent-{request.conversation_id or 'default'}",
            conversation_id=request.conversation_id or "default",
            choices=[choice],
            usage=usage,
            tool_calls=result.get("tool_calls", []),
            agent_state=result.get("agent_state", {})
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent processing error: {str(e)}"
        )

@router.get("/tools")
async def list_available_tools():
    """List all available tools for the agent"""
    
    try:
        tools = agent_service.get_available_tools()
        return {
            "tools": tools,
            "total_count": len(tools)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing tools: {str(e)}"
        )

@router.get("/status")
async def agent_status():
    """Get agent system status"""
    
    try:
        # Basic health check for the agent system
        tools = agent_service.get_available_tools()
        
        return {
            "status": "healthy",
            "agent_type": "langgraph_react",
            "available_tools": len(tools),
            "llm_provider": "anthropic" if "anthropic" in str(type(agent_service.llm)).lower() else "openai"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }
