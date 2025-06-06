import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[80%] mr-auto">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-orange-500 text-white text-xs font-medium">
          AI
        </AvatarFallback>
      </Avatar>
      
      <Card className="bg-muted border-muted">
        <CardContent className="p-3">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">AI is typing...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
