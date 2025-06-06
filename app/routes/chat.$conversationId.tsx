import type { Route } from "./+types/chat.$conversationId";
import { EnhancedChatContainer } from "../components/chat/EnhancedChatContainer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agentic Canvas - AI Assistant" },
    { name: "description", content: "Continue your conversation with your AI assistant" },
  ];
}

export default function Chat() {
  return <EnhancedChatContainer />;
}
