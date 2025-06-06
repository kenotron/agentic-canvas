import type { Route } from "./+types/test";
import { TestAISdk } from "../components/test/TestAISdk";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI SDK Test - Agentic Canvas" },
    { name: "description", content: "Test the AI SDK integration with the LLM server" },
  ];
}

export default function Test() {
  return (
    <div className="min-h-screen bg-background">
      <TestAISdk />
    </div>
  );
}