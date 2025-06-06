"""Pydantic models for API requests and responses"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal, Union
from datetime import datetime

# OpenAI-compatible models
class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant", "tool"]
    content: str
    name: Optional[str] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None
    tool_call_id: Optional[str] = None

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    temperature: Optional[float] = Field(default=0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(default=None, gt=0)
    top_p: Optional[float] = Field(default=1.0, ge=0, le=1)
    stream: Optional[bool] = False
    frequency_penalty: Optional[float] = Field(default=0.0, ge=-2, le=2)
    presence_penalty: Optional[float] = Field(default=0.0, ge=-2, le=2)
    tools: Optional[List[Dict[str, Any]]] = None
    tool_choice: Optional[Union[str, Dict[str, Any]]] = None
    user: Optional[str] = None

class ChatChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: Optional[str] = None

class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

class ChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[ChatChoice]
    usage: Usage

# Agent-specific models
class ToolCall(BaseModel):
    id: str
    type: str = "function"
    function: Dict[str, Any]

class AgentChatRequest(BaseModel):
    messages: List[ChatMessage]
    tools: Optional[List[str]] = None
    stream: bool = False
    user_context: Optional[Dict[str, Any]] = None
    conversation_id: Optional[str] = None

class AgentChatResponse(BaseModel):
    id: str
    conversation_id: str
    choices: List[ChatChoice]
    usage: Usage
    tool_calls: Optional[List[ToolCall]] = None
    agent_state: Optional[Dict[str, Any]] = None

# Tool models
class WebSearchRequest(BaseModel):
    query: str
    num_results: int = Field(default=5, ge=1, le=20)
    search_type: Literal["general", "news", "academic"] = "general"

class WebSearchResult(BaseModel):
    title: str
    url: str
    snippet: str
    published_date: Optional[datetime] = None
    source: Optional[str] = None

class WebSearchResponse(BaseModel):
    query: str
    results: List[WebSearchResult]
    total_results: int

class GitHubSearchRequest(BaseModel):
    query: str
    type: Literal["repositories", "issues", "code"] = "repositories"
    sort: Optional[str] = None
    order: Optional[Literal["asc", "desc"]] = "desc"

# OpenAI Responses API models
class ResponseRequest(BaseModel):
    """Request body for creating a response (OpenAI Responses API compatible)"""
    response: str = Field(..., description="The response content to log")
    conversation_id: Optional[str] = Field(None, description="The conversation this response belongs to")
    parent_message_id: Optional[str] = Field(None, description="The message this is a response to")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

class ResponseObject(BaseModel):
    """Response object (OpenAI Responses API compatible)"""
    id: str = Field(..., description="Unique identifier for the response")
    object: str = Field(default="response", description="Object type")
    created: int = Field(..., description="Unix timestamp of creation")
    response: str = Field(..., description="The response content")
    conversation_id: Optional[str] = Field(None, description="The conversation this response belongs to")
    parent_message_id: Optional[str] = Field(None, description="The message this is a response to")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

class ResponseList(BaseModel):
    """List of responses (OpenAI Responses API compatible)"""
    object: str = Field(default="list")
    data: List[ResponseObject]
    has_more: bool = Field(default=False)

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: Optional[int] = None
