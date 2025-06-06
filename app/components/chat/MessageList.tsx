import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "../../utils/types";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="flex flex-col gap-4 p-4 pb-8">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <div className="text-4xl">👋</div>
              <h3 className="text-lg font-medium">Welcome to Agentic Canvas</h3>
              <p className="text-sm">Start a conversation with your AI assistant</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isLoading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}
