"""LangGraph agent implementation for advanced workflows"""

from typing import Annotated, TypedDict, List
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, add_messages
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
import os

from ..tools.web_search import web_search, web_search_news, web_search_academic
from ..tools.github import github_search_repositories, github_get_repository_info, github_search_issues

class AgentState(TypedDict):
    """State definition for the agent workflow"""
    messages: Annotated[List, add_messages]
    user_context: dict
    tool_calls: List[dict]
    conversation_id: str
    current_task: str

class AgentService:
    """Service for managing LangGraph agents"""
    
    def __init__(self):
        self.llm = self._get_llm()
        self.tools = self._get_tools()
        self.agent = self._create_agent()
    
    def _get_llm(self):
        """Initialize the LLM based on available API keys"""
        if os.getenv("ANTHROPIC_API_KEY"):
            return ChatAnthropic(
                model="claude-3-5-sonnet-20241022",
                temperature=0.7,
                max_tokens=4096
            )
        elif os.getenv("OPENAI_API_KEY"):
            return ChatOpenAI(
                model="gpt-4o",
                temperature=0.7,
                max_tokens=4096
            )
        else:
            raise ValueError("No valid API key found for LLM providers")
    
    def _get_tools(self):
        """Get all available tools"""
        return [
            web_search,
            web_search_news,
            web_search_academic,
            github_search_repositories,
            github_get_repository_info,
            github_search_issues,
        ]
    
    def _create_agent(self):
        """Create the LangGraph agent"""
        
        # System message for the agent
        system_message = SystemMessage(content="""
You are an advanced AI assistant with access to various tools for web search and GitHub integration.

Your capabilities include:
- Web search for current information and news
- GitHub repository and issue search
- Code analysis and recommendations
- Research assistance

Guidelines:
1. Always use tools when you need current information or specific data
2. Provide clear, well-structured responses
3. Cite sources when using web search results
4. Be helpful and accurate in your responses
5. If you're unsure about something, say so and suggest how to find the answer

When using tools:
- Use web_search for general information
- Use web_search_news for recent news and events
- Use github_search_repositories to find relevant code repositories
- Use github_get_repository_info for detailed repository information
- Use github_search_issues to find relevant issues or discussions
""")
        
        # Create the ReAct agent
        agent = create_react_agent(
            model=self.llm,
            tools=self.tools,
            state_modifier=system_message
        )
        
        return agent
    
    async def chat(
        self, 
        messages: List[dict], 
        conversation_id: str = None,
        user_context: dict = None
    ) -> dict:
        """
        Process a chat message through the agent workflow
        
        Args:
            messages: List of chat messages
            conversation_id: Optional conversation ID
            user_context: Optional user context
            
        Returns:
            Agent response with tool calls and state
        """
        
        # Convert messages to LangChain format
        lc_messages = []
        for msg in messages:
            if msg["role"] == "user":
                lc_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                lc_messages.append(AIMessage(content=msg["content"]))
            elif msg["role"] == "system":
                lc_messages.append(SystemMessage(content=msg["content"]))
        
        # Create initial state
        initial_state = {
            "messages": lc_messages,
            "user_context": user_context or {},
            "tool_calls": [],
            "conversation_id": conversation_id or "default",
            "current_task": "chat"
        }
        
        try:
            # Run the agent
            result = await self.agent.ainvoke(initial_state)
            
            # Extract the response
            response_message = result["messages"][-1]
            
            return {
                "content": response_message.content,
                "tool_calls": getattr(response_message, 'tool_calls', []),
                "agent_state": {
                    "conversation_id": conversation_id,
                    "total_messages": len(result["messages"]),
                    "tools_used": len([msg for msg in result["messages"] if hasattr(msg, 'tool_calls')])
                }
            }
            
        except Exception as e:
            return {
                "content": f"I apologize, but I encountered an error while processing your request: {str(e)}",
                "tool_calls": [],
                "agent_state": {
                    "error": str(e),
                    "conversation_id": conversation_id
                }
            }
    
    def get_available_tools(self) -> List[dict]:
        """Get information about available tools"""
        tool_info = []
        
        for tool in self.tools:
            tool_info.append({
                "name": tool.name,
                "description": tool.description,
                "parameters": getattr(tool, 'args_schema', {})
            })
        
        return tool_info

# Global agent service instance
agent_service = AgentService()
