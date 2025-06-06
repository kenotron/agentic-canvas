import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "../../utils/types";

export function AISDKChatContainer() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  
  // AI SDK chat hook
  const { messages, isLoading, error, append } = useChat({
    api: '/api/chat',
    id: conversationId,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // If no conversation exists, create one and navigate
    if (!conversationId) {
      const newId = crypto.randomUUID();
      navigate(`/chat/${newId}`);
    }
    
    const userMessage = inputValue;
    setInputValue('');
    
    // Send message using AI SDK's append method
    await append({
      role: 'user',
      content: userMessage,
    });
  };

  // Convert AI SDK messages to our app's message format for display
  const displayMessages = messages.map(m => ({
    id: m.id,
    content: m.content,
    role: m.role === 'user' ? 'user' as const : 'assistant' as const,
    timestamp: new Date(),
  }));

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">
          {conversationId ? "Chat" : "New Chat"}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {displayMessages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
              <p>Send a message to begin chatting with your AI assistant.</p>
            </div>
          )}
          
          {displayMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          {error && (
            <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
              <p>Error: {error.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
