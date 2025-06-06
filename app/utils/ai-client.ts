import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import { z } from 'zod';

// Configure the OpenAI-compatible client to point to our LLM server
const openai = createOpenAI({
  baseURL: 'http://localhost:8000',
  apiKey: 'dummy-key', // Not needed for our local server, but required by the client
});

// Schema for response objects (matching the server's ResponseObject)
const ResponseSchema = z.object({
  id: z.string(),
  created: z.number(),
  response: z.string(),
  conversation_id: z.string().optional(),
  parent_message_id: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type ResponseObject = z.infer<typeof ResponseSchema>;

// Chat completion using AI SDK
export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  try {
    const result = await generateText({
      model: openai(options.model || 'claude-3-sonnet-20240229'),
      messages,
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 2000,
    });

    return {
      content: result.text,
      usage: result.usage,
      finishReason: result.finishReason,
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}

// Streaming chat completion using AI SDK
export async function streamChatResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  try {
    const result = await streamText({
      model: openai(options.model || 'claude-3-sonnet-20240229'),
      messages,
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 2000,
    });

    return result;
  } catch (error) {
    console.error('Error streaming chat response:', error);
    throw error;
  }
}

// Create a response using the responses API
export async function createResponse(
  responseText: string,
  conversationId?: string,
  parentMessageId?: string,
  metadata?: Record<string, any>
): Promise<ResponseObject> {
  try {
    const response = await fetch('http://localhost:8000/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: responseText,
        conversation_id: conversationId,
        parent_message_id: parentMessageId,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create response: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating response:', error);
    throw error;
  }
}

// Get a specific response by ID
export async function getResponse(responseId: string): Promise<ResponseObject> {
  try {
    const response = await fetch(`http://localhost:8000/responses/${responseId}`);

    if (!response.ok) {
      throw new Error(`Failed to get response: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting response:', error);
    throw error;
  }
}

// List responses with optional filtering
export async function listResponses(options: {
  conversationId?: string;
  limit?: number;
  after?: string;
} = {}): Promise<{ data: ResponseObject[]; has_more: boolean }> {
  try {
    const params = new URLSearchParams();
    
    if (options.conversationId) {
      params.append('conversation_id', options.conversationId);
    }
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options.after) {
      params.append('after', options.after);
    }

    const response = await fetch(`http://localhost:8000/responses?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to list responses: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing responses:', error);
    throw error;
  }
}

// Delete a response
export async function deleteResponse(responseId: string): Promise<{ deleted: boolean }> {
  try {
    const response = await fetch(`http://localhost:8000/responses/${responseId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete response: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting response:', error);
    throw error;
  }
}

// Agent chat with enhanced capabilities
export async function sendAgentMessage(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  conversationId?: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    userContext?: Record<string, any>;
  } = {}
) {
  try {
    const response = await fetch('http://localhost:8000/agents/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        conversation_id: conversationId,
        model: options.model || 'claude-3-sonnet-20240229',
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        user_context: options.userContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Agent API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending agent message:', error);
    throw error;
  }
}

// Get agent status
export async function getAgentStatus() {
  try {
    const response = await fetch('http://localhost:8000/agents/status');

    if (!response.ok) {
      throw new Error(`Agent status error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting agent status:', error);
    throw error;
  }
}

// Get available models
export async function getAvailableModels() {
  try {
    const response = await fetch('http://localhost:8000/models');

    if (!response.ok) {
      throw new Error(`Models API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting available models:', error);
    throw error;
  }
}