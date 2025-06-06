import { useState } from 'react';
import { generateChatResponse, createResponse, listResponses } from '../../utils/ai-client';

export function TestAISdk() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBasicChat = async () => {
    setLoading(true);
    setResult('Testing basic chat...');
    
    try {
      const response = await generateChatResponse([
        { role: 'user', content: 'Hello! Say hello back in a friendly way.' }
      ], {
        model: 'claude-3-sonnet-20240229',
        temperature: 0.7
      });
      
      setResult(`✅ Basic chat successful!\nResponse: ${response.content}\nUsage: ${JSON.stringify(response.usage)}`);
    } catch (error) {
      setResult(`❌ Basic chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testResponsesAPI = async () => {
    setLoading(true);
    setResult('Testing responses API...');
    
    try {
      // Create a response
      const createdResponse = await createResponse(
        'This is a test response from the AI SDK integration!',
        'test-conversation-123',
        'test-message-456',
        { test: true, timestamp: new Date().toISOString() }
      );
      
      setResult(prev => prev + `\n✅ Response created: ${createdResponse.id}`);
      
      // List responses
      const { data: responses } = await listResponses({
        conversationId: 'test-conversation-123',
        limit: 5
      });
      
      setResult(prev => prev + `\n✅ Found ${responses.length} responses for conversation`);
      
    } catch (error) {
      setResult(`❌ Responses API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">AI SDK Integration Test</h2>
      
      <div className="space-x-4">
        <button
          onClick={testBasicChat}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Basic Chat
        </button>
        
        <button
          onClick={testResponsesAPI}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Responses API
        </button>
      </div>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
      
      {loading && (
        <div className="mt-4 text-blue-500">
          Testing... Please wait.
        </div>
      )}
    </div>
  );
}