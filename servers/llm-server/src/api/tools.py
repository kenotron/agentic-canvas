"""Direct tool access endpoints"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List

from ..models.api import WebSearchRequest, WebSearchResponse, GitHubSearchRequest, ErrorResponse
from ..services.config import get_settings
from ..tools.web_search import web_search
from ..tools.github import github_search_repositories, github_get_repository_info

router = APIRouter()

@router.post("/search/web")
async def search_web(
    request: WebSearchRequest,
    settings = Depends(get_settings)
):
    """
    Direct web search endpoint using Tavily API.
    
    This allows frontend components to directly search the web without
    going through the full agent workflow.
    """
    
    try:
        result = await web_search(
            query=request.query,
            num_results=request.num_results,
            search_type=request.search_type
        )
        
        return {
            "query": request.query,
            "result": result,
            "search_type": request.search_type,
            "num_results": request.num_results
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Web search error: {str(e)}"
        )

@router.post("/search/github/repositories")
async def search_github_repositories(
    request: GitHubSearchRequest,
    settings = Depends(get_settings)
):
    """
    Search GitHub repositories directly.
    """
    
    try:
        result = await github_search_repositories(
            query=request.query,
            sort=request.sort,
            order=request.order,
            per_page=5
        )
        
        return {
            "query": request.query,
            "result": result,
            "type": request.type
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"GitHub search error: {str(e)}"
        )

@router.get("/search/github/repository/{owner}/{repo}")
async def get_github_repository(
    owner: str,
    repo: str,
    settings = Depends(get_settings)
):
    """
    Get detailed information about a specific GitHub repository.
    """
    
    try:
        result = await github_get_repository_info(owner=owner, repo=repo)
        
        return {
            "owner": owner,
            "repo": repo,
            "result": result
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"GitHub repository info error: {str(e)}"
        )

@router.get("/health")
async def tools_health():
    """Check the health of all tool services"""
    
    health_status = {
        "tavily_api": "unknown",
        "github_api": "unknown",
        "overall_status": "unknown"
    }
    
    try:
        # Test Tavily API
        test_result = await web_search("test", num_results=1)
        if "Error:" not in test_result:
            health_status["tavily_api"] = "healthy"
        else:
            health_status["tavily_api"] = "error"
    except:
        health_status["tavily_api"] = "error"
    
    try:
        # Test GitHub API
        test_result = await github_search_repositories("python", per_page=1)
        if "Error:" not in test_result:
            health_status["github_api"] = "healthy"
        else:
            health_status["github_api"] = "error"
    except:
        health_status["github_api"] = "error"
    
    # Determine overall status
    if all(status == "healthy" for status in [health_status["tavily_api"], health_status["github_api"]]):
        health_status["overall_status"] = "healthy"
    elif any(status == "healthy" for status in [health_status["tavily_api"], health_status["github_api"]]):
        health_status["overall_status"] = "partial"
    else:
        health_status["overall_status"] = "error"
    
    return health_status
