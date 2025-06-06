import { TestAISdk } from "../components/test/TestAISdk";
import { TestAISDKUI } from "../components/test/TestAISDKUI";

export function meta() {
  return [
    { title: "AI SDK Test - Agentic Canvas" },
    { name: "description", content: "Test the AI SDK integration with the LLM server" },
  ];
}

export default function Test() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container p-4">
        <h1 className="text-3xl font-bold mb-8">AI SDK Tests</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">AI SDK Core Tests</h2>
          <TestAISdk />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">AI SDK UI Hooks Tests</h2>
          <TestAISDKUI />
        </div>
      </div>
    </div>
  );
}