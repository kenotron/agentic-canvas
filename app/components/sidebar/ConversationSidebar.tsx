import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { cn } from "../../lib/utils";
import type { Conversation } from "../../utils/types";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  isOpen,
  onToggle
}: ConversationSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-30 h-full w-80 transform border-r bg-background transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between px-4 border-b">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={onNewConversation}
              className="w-full justify-start"
              variant="outline"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Conversation
            </Button>
          </div>

          <Separator />

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    currentConversationId === conversation.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <div className="truncate font-medium">
                    {conversation.title}
                  </div>
                  <div className="truncate text-xs opacity-70">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
              
              {conversations.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No conversations yet.
                  <br />
                  Start a new chat to begin!
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
