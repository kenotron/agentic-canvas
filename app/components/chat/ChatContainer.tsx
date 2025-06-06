import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ConversationSidebar } from "../sidebar/ConversationSidebar";
import type { Message, Conversation } from "../../utils/types";
import { sendChatMessageStream, type ChatMessage } from "../../utils/api";

// Storage key for persisting conversations
const CONVERSATIONS_STORAGE_KEY = 'agentic-canvas-conversations';

// Helper functions for conversation persistence
const saveConversations = (conversations: Conversation[]) => {
  try {
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.warn('Failed to save conversations to localStorage:', error);
  }
};

const loadConversations = (): Conversation[] => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    }
  } catch (error) {
    console.warn('Failed to load conversations from localStorage:', error);
  }
  return [];
};

export function ChatContainer() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = loadConversations();
    setConversations(savedConversations);
    setInitialLoadComplete(true);
  }, []);

  // Save conversations whenever they change
  useEffect(() => {
    if (initialLoadComplete && conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations, initialLoadComplete]);

  // Sync current conversation with URL
  const currentConversationId = conversationId || null;
  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    let targetConversationId = currentConversationId;

    // Create new conversation if none exists
    if (!targetConversationId) {
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setConversations(prev => [newConversation, ...prev]);
      targetConversationId = newConversation.id;
      
      // Navigate to the new conversation
      navigate(`/chat/${targetConversationId}`);
    }

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === targetConversationId
          ? { ...conv, messages: [...conv.messages, userMessage], updatedAt: new Date() }
          : conv
      )
    );

    setIsLoading(true);

    // Create assistant message for streaming
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    };

    // Add streaming message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === targetConversationId
          ? { ...conv, messages: [...conv.messages, assistantMessage], updatedAt: new Date() }
          : conv
      )
    );

    try {
      // Get conversation history for context
      const currentConv = conversations.find(c => c.id === targetConversationId);
      const chatMessages: ChatMessage[] = [
        ...(currentConv?.messages || []).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content,
        }
      ];

      // Create assistant message for streaming
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: '',
        role: "assistant",
        timestamp: new Date(),
        isStreaming: true,
      };

      // Add streaming message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === targetConversationId
            ? { ...conv, messages: [...conv.messages, assistantMessage], updatedAt: new Date() }
            : conv
        )
      );

      // Stream the response
      await sendChatMessageStream(
        chatMessages,
        (chunk: string) => {
          setConversations(prev => 
            prev.map(conv => 
              conv.id === targetConversationId
                ? {
                    ...conv,
                    messages: conv.messages.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + chunk }
                        : msg
                    ),
                    updatedAt: new Date()
                  }
                : conv
            )
          );
        },
        {
          model: 'claude-3-sonnet-20240229',
          temperature: 0.7,
        }
      );

      // Mark streaming as complete
      setConversations(prev => 
        prev.map(conv => 
          conv.id === targetConversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, isStreaming: false }
                    : msg
                ),
                updatedAt: new Date()
              }
            : conv
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove the streaming message and add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the LLM server is running on http://localhost:8000`,
        role: "assistant",
        timestamp: new Date(),
      };

      setConversations(prev => 
        prev.map(conv => 
          conv.id === targetConversationId
            ? { 
                ...conv, 
                messages: conv.messages.filter(msg => !(msg.id === assistantMessageId && msg.isStreaming)).concat([errorMessage]), 
                updatedAt: new Date() 
              }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    navigate('/chat');
  };

  const handleSelectConversation = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 lg:hidden"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="ml-4 text-lg font-semibold">
              {currentConversation?.title || "New Conversation"}
            </h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <MessageList 
            messages={currentConversation?.messages || []}
            isLoading={isLoading}
          />
        </div>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <MessageInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
