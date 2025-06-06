// Types for the chat application

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface APIResponse<T> {
  data: T;
  error?: string;
}

export interface SendMessageRequest {
  content: string;
  conversationId?: string;
}

export interface SendMessageResponse {
  message: Message;
  conversationId: string;
}
