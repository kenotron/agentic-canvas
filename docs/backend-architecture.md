# LLM Server Architecture Documentation

## Overview

The LLM server provides a production-ready backend for the Claude clone with full OpenAI API compatibility and advanced agent capabilities. It supports tool integration, web search, GitHub, Gmail, and other external services.

## Architecture Design

### Core Components

1. **API Layer**: FastAPI with OpenAI-compatible endpoints
2. **LLM Proxy**: LiteLLM for multi-provider LLM access
3. **Agent Framework**: LangGraph for complex agent workflows
4. **Tool Integration**: Custom tools for web search, GitHub, Gmail, etc.
5. **Data Layer**: Vector database for memory and context

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   LLM Providers │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (LiteLLM)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Agent Engine  │
                       │   (LangGraph)   │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Tool Layer    │
                       │  (Web, GitHub,  │
                       │   Gmail, etc.)  │
                       └─────────────────┘
```

## Technology Stack

### Primary Framework: FastAPI + LiteLLM + LangGraph

**Rationale**: This combination provides:
- ✅ 100% OpenAI API compatibility via LiteLLM
- ✅ Production-ready performance with FastAPI
- ✅ Advanced agent capabilities with LangGraph
- ✅ Easy deployment and scaling
- ✅ Extensive tool ecosystem

### Alternative Considered: Custom FastAPI + Direct LLM Integration
**Rejected because**: More development overhead, less compatibility, harder to maintain

## OpenAI API Compatibility

### Implementation Strategy: LiteLLM Proxy

LiteLLM provides a production-ready proxy that exposes OpenAI-compatible endpoints while supporting multiple LLM providers.

**Supported Endpoints**:
- `POST /chat/completions` - Main chat endpoint
- `POST /completions` - Legacy completions
- `POST /embeddings` - Text embeddings
- `GET /models` - List available models
- `POST /key/generate` - API key management

**Configuration Example**:
```yaml
model_list:
  - model_name: gpt-4o-mini
    litellm_params:
      model: claude-3-5-sonnet-20241022
      api_key: "os.environ/ANTHROPIC_API_KEY"
  
  - model_name: gpt-4o
    litellm_params:
      model: claude-3-opus-20240229
      api_key: "os.environ/ANTHROPIC_API_KEY"

  - model_name: text-embedding-3-small
    litellm_params:
      model: openai/text-embedding-3-small
      api_key: "os.environ/OPENAI_API_KEY"
```

## Agent Framework: LangGraph

### Why LangGraph over LangChain AgentExecutor

LangGraph is the recommended successor to LangChain's AgentExecutor, providing:
- **Better Control**: State-based workflow management
- **Flexibility**: Custom agent architectures
- **Reliability**: More predictable execution patterns
- **Debuggability**: Clear state transitions and logging

### Agent Architecture

```python
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import create_react_agent

# State definition
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_info: dict
    tool_calls: list
    context: str

# Tool definitions
tools = [
    web_search_tool,
    github_tool,
    gmail_tool,
    file_tool,
    calculator_tool
]

# Create agent
agent = create_react_agent(llm, tools, state_modifier=state_modifier)
```

## Tool Integration

### Core Tools

1. **Web Search Tool**
   - Provider: Tavily, SerpAPI, or Brave Search
   - Capabilities: Real-time web search, news, academic papers
   - Rate limiting and caching

2. **GitHub Tool**
   - Capabilities: Repository access, issue management, code analysis
   - Authentication: GitHub App or Personal Access Token
   - Permissions: Read repositories, create issues/PRs

3. **Gmail Tool**
   - Capabilities: Read emails, send emails, manage labels
   - Authentication: OAuth 2.0 with Gmail API
   - Privacy: User consent and data handling compliance

4. **File Management Tool**
   - Capabilities: Upload, download, analyze files
   - Supported formats: Text, PDF, images, code files
   - Storage: Local filesystem or cloud storage

5. **Calculator/Code Execution Tool**
   - Capabilities: Mathematical calculations, code execution
   - Security: Sandboxed execution environment
   - Languages: Python, JavaScript, shell commands

### Tool Implementation Pattern

```python
from langchain_core.tools import tool
from typing import Optional

@tool
def web_search(query: str, num_results: int = 5) -> str:
    """Search the web for current information.
    
    Args:
        query: The search query
        num_results: Number of results to return (default: 5)
    
    Returns:
        Formatted search results with titles, snippets, and URLs
    """
    # Implementation details
    pass
```

## API Endpoints

### Core Endpoints

```python
# FastAPI application structure
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel

app = FastAPI(title="Agentic Canvas LLM Server")

# OpenAI-compatible endpoints (proxied through LiteLLM)
app.mount("/v1", litellm_app)

# Custom agent endpoints
@app.post("/chat/agent")
async def agent_chat(request: AgentChatRequest):
    """Enhanced chat with agent capabilities"""
    pass

@app.post("/tools/search")
async def web_search(request: SearchRequest):
    """Direct web search endpoint"""
    pass

@app.get("/agent/status")
async def agent_status():
    """Get agent execution status"""
    pass
```

### Request/Response Models

```python
class AgentChatRequest(BaseModel):
    messages: List[ChatMessage]
    tools: Optional[List[str]] = None
    stream: bool = False
    user_context: Optional[Dict] = None

class AgentChatResponse(BaseModel):
    id: str
    choices: List[ChatChoice]
    usage: TokenUsage
    tool_calls: Optional[List[ToolCall]] = None
```

## Deployment Architecture

### Development Setup
```bash
# Install dependencies
pip install "fastapi[standard]" "litellm[proxy]" langgraph langchain-anthropic

# Environment variables
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
export TAVILY_API_KEY="your-key"

# Run development server
fastapi dev main.py
```

### Production Deployment Options

1. **Docker Container**
   ```dockerfile
   FROM python:3.12-slim
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Azure Container Apps** (Recommended)
   - Auto-scaling based on load
   - Integration with Azure AI services
   - Built-in monitoring and logging

3. **Azure Functions** (Serverless option)
   - Pay-per-use pricing
   - Good for variable workloads
   - Cold start considerations

## Security Considerations

### API Security
- **Authentication**: JWT tokens or API keys
- **Rate Limiting**: Per-user and global limits
- **Input Validation**: Strict request validation
- **CORS**: Configured for frontend domain

### Tool Security
- **Sandboxing**: Isolated execution for code tools
- **Permission Management**: User-scoped tool access
- **Data Privacy**: No logging of sensitive data
- **API Key Management**: Secure storage and rotation

## Monitoring and Observability

### Metrics
- Request latency and throughput
- LLM token usage and costs
- Tool execution success rates
- Error rates by endpoint

### Logging
- Structured logging with correlation IDs
- Tool execution traces
- Performance metrics
- Security events

### Tools
- **Application Insights**: Azure-native monitoring
- **LangSmith**: LangChain-specific observability
- **OpenTelemetry**: Standard observability framework

## Configuration Management

### Environment-based Configuration
```python
class Settings(BaseSettings):
    anthropic_api_key: str
    openai_api_key: str
    tavily_api_key: str
    database_url: str
    redis_url: str
    cors_origins: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
```

## Future Enhancements

### Phase 1 (MVP)
- [ ] Basic chat with Claude integration
- [ ] Web search tool
- [ ] File upload/analysis
- [ ] OpenAI API compatibility

### Phase 2 (Enhanced Agents)
- [ ] GitHub integration
- [ ] Gmail integration
- [ ] Multi-step reasoning
- [ ] Conversation memory

### Phase 3 (Advanced Features)
- [ ] Custom tool creation UI
- [ ] Workflow automation
- [ ] Multi-agent collaboration
- [ ] Advanced analytics

## Development Guidelines

### Code Organization
```
servers/llm-server/
├── src/
│   ├── api/           # FastAPI routes
│   ├── agents/        # LangGraph agents
│   ├── tools/         # Tool implementations
│   ├── models/        # Pydantic models
│   ├── services/      # Business logic
│   └── utils/         # Utilities
├── tests/             # Test suite
├── config/            # Configuration files
└── docs/              # API documentation
```

### Testing Strategy
- **Unit Tests**: Individual tool and function testing
- **Integration Tests**: Agent workflow testing
- **Load Tests**: Performance and scalability testing
- **Security Tests**: Penetration testing and vulnerability scanning

## Cost Optimization

### LLM Cost Management
- **Model Selection**: Right-sized models for different tasks
- **Caching**: Response caching for common queries
- **Streaming**: Reduce perceived latency
- **Usage Monitoring**: Track and alert on usage spikes

### Infrastructure Costs
- **Auto-scaling**: Scale down during low usage
- **Spot Instances**: Use for non-critical workloads
- **Resource Optimization**: Right-size containers and databases
