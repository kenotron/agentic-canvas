// API utilities for communicating with the LLM server

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AgentChatRequest {
  messages: ChatMessage[];
  conversation_id?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AgentChatResponse {
  id: string;
  conversation_id: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  tool_calls?: any[];
  agent_state?: any;
}

// Configuration
const API_BASE_URL = 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Basic chat completion (OpenAI compatible)
export async function sendChatMessage(
  messages: ChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<ChatCompletionResponse> {
  const request: ChatCompletionRequest = {
    model: options.model || 'gpt-4',
    messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 2000,
    stream: false,
  };

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, `Chat API error: ${error}`);
  }

  return response.json();
}

// Streaming chat completion
export async function sendChatMessageStream(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<void> {
  const request: ChatCompletionRequest = {
    model: options.model || 'gpt-4',
    messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 2000,
    stream: true,
  };

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, `Chat API error: ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Ignore parsing errors for malformed chunks
            console.warn('Failed to parse SSE chunk:', data);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Enhanced agent chat
export async function sendAgentMessage(
  messages: ChatMessage[],
  conversationId?: string,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<AgentChatResponse> {
  const request: AgentChatRequest = {
    messages,
    conversation_id: conversationId,
    model: options.model || 'claude-3-sonnet-20240229',
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 2000,
  };

  const response = await fetch(`${API_BASE_URL}/agents/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, `Agent API error: ${error}`);
  }

  return response.json();
}

// Get available models
export async function getAvailableModels(): Promise<{
  object: string;
  data: Array<{
    id: string;
    object: string;
    created: number;
    owned_by: string;
  }>;
}> {
  const response = await fetch(`${API_BASE_URL}/models`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, `Models API error: ${error}`);
  }

  return response.json();
}

// Web search tool
export async function searchWeb(
  query: string,
  numResults: number = 5,
  searchType: 'general' | 'news' | 'academic' = 'general'
): Promise<{
  query: string;
  result: string;
  search_type: string;
  num_results: number;
}> {
  const response = await fetch(`${API_BASE_URL}/tools/search/web`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      num_results: numResults,
      search_type: searchType,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, `Web search error: ${error}`);
  }

  return response.json();
}

// Agent status
export async function getAgentStatus(): Promise<{
  status: string;
  agent_type?: string;
  available_tools?: number;
  llm_provider?: string;
  error?: string;
}> {
  const response = await fetch(`${API_BASE_URL}/agents/status`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, `Agent status error: ${error}`);
  }

  return response.json();
}
