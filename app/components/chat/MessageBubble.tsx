import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";
import type { Message } from "../../utils/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "flex gap-3 max-w-[80%]",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={isUser ? undefined : "/claude-avatar.png"} />
        <AvatarFallback className={cn(
          "text-xs font-medium",
          isUser ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
        )}>
          {isUser ? "You" : "AI"}
        </AvatarFallback>
      </Avatar>
      
      <Card className={cn(
        "relative",
        isUser 
          ? "bg-blue-500 text-white border-blue-500" 
          : "bg-muted border-muted"
      )}>
        <CardContent className="p-3">
          <div className="prose prose-sm max-w-none">
            <p className={cn(
              "text-sm leading-relaxed m-0 whitespace-pre-wrap",
              isUser ? "text-white" : "text-foreground"
            )}>
              {message.content}
            </p>
          </div>
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-blue-100" : "text-muted-foreground"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
