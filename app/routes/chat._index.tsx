import type { Route } from "./+types/chat._index";
import { AISDKChatContainer } from "../components/chat/AISDKChatContainer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agentic Canvas - New Chat" },
    { name: "description", content: "Start a new conversation with your AI assistant" },
  ];
}

export default function NewChat() {
  return <AISDKChatContainer />;
}
