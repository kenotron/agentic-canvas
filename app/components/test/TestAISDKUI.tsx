import { useChat } from '@ai-sdk/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { useState } from 'react';

export function TestAISDKUI() {
  // A simple test of the AI SDK UI hooks with our API route
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [],
    onError: (err) => console.error('Chat error:', err),
  });
  
  const [logs, setLogs] = useState<string[]>([
    'AI SDK UI Hooks Test',
    'Send a message to test the integration',
  ]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      addLog(`Sending message: ${input}`);
      handleSubmit(e);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI SDK UI Hooks Test</h1>
      <Card className="mb-6 p-4">
        <h2 className="text-lg font-semibold mb-2">Test Chat</h2>
        <div className="border rounded-md p-4 mb-4 min-h-40 max-h-80 overflow-auto">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`mb-2 p-2 rounded-md ${
                m.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              }`}
              style={{ maxWidth: '80%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <p className="text-xs text-gray-600 mb-1">{m.role}</p>
              <p>{m.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-100 p-2 rounded-md animate-pulse">
              <p>AI is thinking...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 p-2 rounded-md text-red-800">
              <p>Error: {error.message}</p>
            </div>
          )}
        </div>
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <Input 
            value={input} 
            onChange={handleInputChange} 
            placeholder="Send a message..." 
            disabled={isLoading} 
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Logs</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-60 overflow-auto">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">
              <span className="opacity-60">[{new Date().toLocaleTimeString()}]</span> {log}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
