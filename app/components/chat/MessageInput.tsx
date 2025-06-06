import { useState, useRef, type KeyboardEvent } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    // Auto-resize textarea
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  return (
    <div className="p-4">
      <div className="relative flex items-end gap-3 max-w-3xl mx-auto">
        <div className="flex-1 min-h-[44px] relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={disabled}
            className="min-h-[44px] max-h-[120px] resize-none pr-12 py-3"
            rows={1}
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="sm"
          className="h-[44px] px-4"
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground text-center mt-2 max-w-3xl mx-auto">
        Press Enter to send, Shift+Enter for a new line
      </div>
    </div>
  );
}
