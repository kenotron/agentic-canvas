"""Web search tool using Tavily API"""

from langchain_core.tools import tool
from typing import List, Optional
import httpx
import os
from datetime import datetime

@tool
async def web_search(
    query: str, 
    num_results: int = 5,
    search_type: str = "general"
) -> str:
    """Search the web for current information using Tavily API.
    
    Args:
        query: The search query
        num_results: Number of results to return (1-20)
        search_type: Type of search - "general", "news", or "academic"
    
    Returns:
        Formatted search results with titles, snippets, and URLs
    """
    
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return "Error: Tavily API key not configured"
    
    url = "https://api.tavily.com/search"
    
    payload = {
        "api_key": api_key,
        "query": query,
        "max_results": min(max(1, num_results), 20),
        "search_depth": "advanced" if search_type == "academic" else "basic",
        "include_domains": ["news.com", "bbc.com", "reuters.com"] if search_type == "news" else None,
        "include_answer": True,
        "include_raw_content": False
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=30.0)
            
            if response.status_code != 200:
                return f"Error: Tavily API returned status {response.status_code}"
            
            data = response.json()
            results = data.get("results", [])
            
            if not results:
                return f"No results found for query: {query}"
            
            # Format results
            formatted_results = []
            for i, result in enumerate(results[:num_results], 1):
                title = result.get("title", "No title")
                url = result.get("url", "")
                snippet = result.get("content", "No description available")
                
                formatted_results.append(
                    f"{i}. **{title}**\n"
                    f"   URL: {url}\n"
                    f"   {snippet[:200]}{'...' if len(snippet) > 200 else ''}\n"
                )
            
            # Include answer if available
            answer = data.get("answer")
            result_text = f"Search results for '{query}':\n\n"
            
            if answer:
                result_text += f"**Quick Answer:** {answer}\n\n"
            
            result_text += "\n".join(formatted_results)
            
            return result_text
            
        except httpx.RequestError as e:
            return f"Error: Failed to connect to Tavily API: {str(e)}"
        except Exception as e:
            return f"Error: Unexpected error during search: {str(e)}"

@tool
async def web_search_news(query: str, num_results: int = 5) -> str:
    """Search for recent news articles.
    
    Args:
        query: The search query
        num_results: Number of results to return (1-20)
    
    Returns:
        Formatted news results with titles, snippets, and URLs
    """
    return await web_search(query, num_results, "news")

@tool
async def web_search_academic(query: str, num_results: int = 5) -> str:
    """Search for academic papers and scholarly content.
    
    Args:
        query: The search query
        num_results: Number of results to return (1-20)
    
    Returns:
        Formatted academic results with titles, snippets, and URLs
    """
    return await web_search(query, num_results, "academic")
