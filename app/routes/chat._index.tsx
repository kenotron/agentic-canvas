import type { Route } from "./+types/chat._index";
import { ChatContainer } from "../components/chat/ChatContainer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agentic Canvas - New Chat" },
    { name: "description", content: "Start a new conversation with your AI assistant" },
  ];
}

export default function NewChat() {
  return <ChatContainer />;
}
