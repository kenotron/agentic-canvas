"""GitHub integration tool"""

from langchain_core.tools import tool
import httpx
import os
from typing import Optional, Dict, Any
import json

@tool
async def github_search_repositories(
    query: str,
    language: Optional[str] = None,
    sort: str = "stars",
    order: str = "desc",
    per_page: int = 5
) -> str:
    """Search GitHub repositories.
    
    Args:
        query: Search query for repositories
        language: Programming language filter (e.g., "python", "javascript")
        sort: Sort by "stars", "forks", "help-wanted-issues", "updated"
        order: Sort order "asc" or "desc"
        per_page: Number of results (1-20)
    
    Returns:
        Formatted repository search results
    """
    
    token = os.getenv("GITHUB_TOKEN")
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Agentic-Canvas-LLM-Server"
    }
    
    if token:
        headers["Authorization"] = f"token {token}"
    
    # Build search query
    search_query = query
    if language:
        search_query += f" language:{language}"
    
    params = {
        "q": search_query,
        "sort": sort,
        "order": order,
        "per_page": min(max(1, per_page), 20)
    }
    
    url = "https://api.github.com/search/repositories"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, headers=headers, timeout=30.0)
            
            if response.status_code != 200:
                return f"Error: GitHub API returned status {response.status_code}: {response.text}"
            
            data = response.json()
            items = data.get("items", [])
            
            if not items:
                return f"No repositories found for query: {query}"
            
            formatted_results = []
            for i, repo in enumerate(items, 1):
                name = repo.get("full_name", "Unknown")
                description = repo.get("description", "No description")
                stars = repo.get("stargazers_count", 0)
                forks = repo.get("forks_count", 0)
                language = repo.get("language", "Unknown")
                url = repo.get("html_url", "")
                
                formatted_results.append(
                    f"{i}. **{name}**\n"
                    f"   ⭐ {stars} stars | 🍴 {forks} forks | 💻 {language}\n"
                    f"   {description}\n"
                    f"   URL: {url}\n"
                )
            
            total_count = data.get("total_count", 0)
            result_text = f"Found {total_count} repositories for '{query}':\n\n"
            result_text += "\n".join(formatted_results)
            
            return result_text
            
        except httpx.RequestError as e:
            return f"Error: Failed to connect to GitHub API: {str(e)}"
        except Exception as e:
            return f"Error: Unexpected error during GitHub search: {str(e)}"

@tool
async def github_get_repository_info(owner: str, repo: str) -> str:
    """Get detailed information about a specific GitHub repository.
    
    Args:
        owner: Repository owner (username or organization)
        repo: Repository name
    
    Returns:
        Detailed repository information
    """
    
    token = os.getenv("GITHUB_TOKEN")
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Agentic-Canvas-LLM-Server"
    }
    
    if token:
        headers["Authorization"] = f"token {token}"
    
    url = f"https://api.github.com/repos/{owner}/{repo}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=30.0)
            
            if response.status_code != 200:
                if response.status_code == 404:
                    return f"Repository {owner}/{repo} not found"
                return f"Error: GitHub API returned status {response.status_code}: {response.text}"
            
            repo_data = response.json()
            
            # Get README content
            readme_url = f"https://api.github.com/repos/{owner}/{repo}/readme"
            readme_response = await client.get(readme_url, headers=headers)
            readme_content = ""
            
            if readme_response.status_code == 200:
                readme_data = readme_response.json()
                # Note: In a real implementation, you'd decode the base64 content
                readme_content = "README available (content truncated for brevity)"
            
            # Format repository information
            result = f"**Repository: {repo_data.get('full_name')}**\n\n"
            result += f"Description: {repo_data.get('description', 'No description')}\n"
            result += f"Language: {repo_data.get('language', 'Unknown')}\n"
            result += f"Stars: {repo_data.get('stargazers_count', 0)}\n"
            result += f"Forks: {repo_data.get('forks_count', 0)}\n"
            result += f"Open Issues: {repo_data.get('open_issues_count', 0)}\n"
            result += f"Created: {repo_data.get('created_at', 'Unknown')}\n"
            result += f"Last Updated: {repo_data.get('updated_at', 'Unknown')}\n"
            result += f"License: {repo_data.get('license', {}).get('name', 'No license') if repo_data.get('license') else 'No license'}\n"
            result += f"URL: {repo_data.get('html_url', '')}\n"
            
            if repo_data.get('topics'):
                result += f"Topics: {', '.join(repo_data['topics'])}\n"
            
            if readme_content:
                result += f"\n{readme_content}"
            
            return result
            
        except httpx.RequestError as e:
            return f"Error: Failed to connect to GitHub API: {str(e)}"
        except Exception as e:
            return f"Error: Unexpected error getting repository info: {str(e)}"

@tool
async def github_search_issues(
    query: str,
    state: str = "open",
    sort: str = "created",
    order: str = "desc",
    per_page: int = 5
) -> str:
    """Search GitHub issues across repositories.
    
    Args:
        query: Search query for issues
        state: Issue state "open", "closed", or "all"
        sort: Sort by "created", "updated", "comments"
        order: Sort order "asc" or "desc"
        per_page: Number of results (1-20)
    
    Returns:
        Formatted issue search results
    """
    
    token = os.getenv("GITHUB_TOKEN")
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Agentic-Canvas-LLM-Server"
    }
    
    if token:
        headers["Authorization"] = f"token {token}"
    
    # Build search query
    search_query = f"{query} type:issue"
    if state != "all":
        search_query += f" state:{state}"
    
    params = {
        "q": search_query,
        "sort": sort,
        "order": order,
        "per_page": min(max(1, per_page), 20)
    }
    
    url = "https://api.github.com/search/issues"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, headers=headers, timeout=30.0)
            
            if response.status_code != 200:
                return f"Error: GitHub API returned status {response.status_code}: {response.text}"
            
            data = response.json()
            items = data.get("items", [])
            
            if not items:
                return f"No issues found for query: {query}"
            
            formatted_results = []
            for i, issue in enumerate(items, 1):
                title = issue.get("title", "Unknown")
                repo_name = issue.get("repository_url", "").split("/")[-2:] if issue.get("repository_url") else ["", ""]
                repo_full_name = "/".join(repo_name) if len(repo_name) == 2 else "Unknown"
                state = issue.get("state", "unknown")
                comments = issue.get("comments", 0)
                url = issue.get("html_url", "")
                created_at = issue.get("created_at", "Unknown")
                
                state_emoji = "🟢" if state == "open" else "🔴"
                
                formatted_results.append(
                    f"{i}. {state_emoji} **{title}**\n"
                    f"   Repository: {repo_full_name}\n"
                    f"   💬 {comments} comments | Created: {created_at}\n"
                    f"   URL: {url}\n"
                )
            
            total_count = data.get("total_count", 0)
            result_text = f"Found {total_count} issues for '{query}':\n\n"
            result_text += "\n".join(formatted_results)
            
            return result_text
            
        except httpx.RequestError as e:
            return f"Error: Failed to connect to GitHub API: {str(e)}"
        except Exception as e:
            return f"Error: Unexpected error during GitHub issue search: {str(e)}"
