import type { Route } from "./+types/chat.$conversationId";
import { AISDKChatContainer } from "../components/chat/AISDKChatContainer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agentic Canvas - AI Assistant" },
    { name: "description", content: "Continue your conversation with your AI assistant" },
  ];
}

export default function Chat() {
  return <AISDKChatContainer />;
}
