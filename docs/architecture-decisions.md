# Architecture Decisions Record (ADR)

## ADR-001: Frontend Framework Choice
**Date**: June 5, 2025
**Status**: Decided
**Decision**: Use React Router 7 with React 19

**Context**: 
The project already has React Router 7 configured, which is the latest version with improved data loading and type safety.

**Decision**: 
Continue with React Router 7 as the primary frontend framework.

**Consequences**:
- ✅ Modern React patterns with concurrent features
- ✅ Excellent TypeScript integration
- ✅ Built-in data loading patterns
- ❌ Learning curve for new React Router 7 patterns

---

## ADR-002: Styling Approach
**Date**: June 5, 2025
**Status**: Decided
**Decision**: Use Tailwind CSS 4

**Context**: 
Project has Tailwind CSS 4 already configured. For a Claude clone, we need consistent, professional styling.

**Decision**: 
Use Tailwind CSS for all styling with utility-first approach.

**Consequences**:
- ✅ Rapid prototyping and development
- ✅ Consistent design system
- ✅ Small bundle size with purging
- ❌ HTML can become verbose

---

## ADR-003: Chat Interface Architecture
**Date**: June 5, 2025
**Status**: Proposed
**Decision**: Component-based chat architecture

**Context**: 
Need to build a chat interface similar to Claude with messages, input, and conversation history.

**Proposed Structure**:
```
app/
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx
│   │   ├── MessageList.tsx
│   │   ├── Message.tsx
│   │   ├── MessageInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── sidebar/
│   │   ├── ConversationList.tsx
│   │   └── ConversationItem.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Avatar.tsx
├── routes/
│   ├── chat.$.tsx      # Chat route with conversation ID
│   └── chat._index.tsx # New chat route
└── utils/
    ├── types.ts
    └── api.ts
```

**Consequences**:
- ✅ Modular and reusable components
- ✅ Clear separation of concerns
- ✅ Easy to test individual components
- ❌ More initial setup required

---

## ADR-004: State Management
**Date**: June 5, 2025
**Status**: Proposed
**Decision**: Use React Router 7 loaders/actions + React state

**Context**: 
Need to manage chat state, conversation history, and real-time updates.

**Decision**: 
- Use React Router 7 loaders for initial data loading
- Use React state (useState/useReducer) for local component state
- Consider adding Zustand or Jotai if global state becomes complex

**Consequences**:
- ✅ Leverages React Router 7's data patterns
- ✅ Keeps state management simple initially
- ✅ Can evolve as needs grow
- ❌ May need refactoring if state becomes complex

---

## ADR-005: Backend Communication
**Date**: June 5, 2025
**Status**: Proposed
**Decision**: REST API with WebSocket for real-time features

**Context**: 
Need to communicate with the LLM server for sending messages and receiving responses.

**Decision**: 
- REST API for CRUD operations (conversations, messages)
- WebSocket for real-time message streaming
- Use fetch API with React Router 7 actions

**Consequences**:
- ✅ Standard patterns, easy to implement
- ✅ Real-time capabilities for streaming responses
- ✅ Good separation between sync and async operations
- ❌ Need to handle WebSocket connection management

---

## ADR-006: OpenAI API Compatibility Strategy
**Date**: June 5, 2025
**Status**: Decided
**Decision**: Use LiteLLM proxy for 100% OpenAI API compatibility

**Context**: 
Need to provide OpenAI-compatible endpoints while using Claude and other LLM providers. This ensures frontend compatibility with existing OpenAI SDKs and tools.

**Decision**: 
Implement LiteLLM as a proxy layer that translates OpenAI API calls to various LLM providers.

**Implementation**:
- LiteLLM proxy handles `/chat/completions`, `/completions`, `/embeddings`, `/models`
- Model mapping: `gpt-4o` → `claude-3-5-sonnet`, `gpt-4o-mini` → `claude-3-haiku`
- Configuration via YAML file for easy model management
- Built-in rate limiting, monitoring, and error handling

**Consequences**:
- ✅ 100% OpenAI API compatibility
- ✅ Support for 100+ LLM providers
- ✅ Production-ready with monitoring
- ✅ Easy to switch between providers
- ❌ Additional abstraction layer
- ❌ Dependency on LiteLLM project

---

## ADR-007: Agent Framework Selection
**Date**: June 5, 2025
**Status**: Decided
**Decision**: Use LangGraph for agent workflows

**Context**: 
Need an agent framework that supports complex tool integration, web search, GitHub, Gmail, etc. Evaluated LangChain AgentExecutor, LangGraph, CrewAI, and AutoGen.

**Decision**: 
Use LangGraph as the primary agent framework for advanced workflows.

**Rationale**:
- LangGraph is the recommended successor to LangChain's AgentExecutor
- State-based workflow management provides better control
- Excellent debugging and observability features
- Strong integration with LangChain tool ecosystem
- Active development and community support

**Consequences**:
- ✅ Flexible state-based agent architecture
- ✅ Better debugging and observability
- ✅ Strong tool integration capabilities
- ✅ Production-ready patterns
- ❌ Learning curve for state-based patterns
- ❌ More complex than simple agent executors

---

## ADR-008: Backend API Framework
**Date**: June 5, 2025
**Status**: Decided
**Decision**: Use FastAPI for the backend API layer

**Context**: 
Need a Python web framework that can handle high-performance API requests, integrates well with LiteLLM and LangGraph, and provides good developer experience.

**Decision**: 
Use FastAPI as the primary backend framework.

**Rationale**:
- High performance (one of the fastest Python frameworks)
- Excellent async support for LLM API calls
- Built-in OpenAPI documentation generation
- Strong TypeScript-like type hints with Pydantic
- Easy integration with LiteLLM and LangGraph
- Production-ready with dependency injection

**Consequences**:
- ✅ High performance and scalability
- ✅ Excellent developer experience
- ✅ Built-in API documentation
- ✅ Strong typing and validation
- ✅ Easy deployment and containerization
- ❌ Python async patterns can be complex

---

## ADR-009: Tool Integration Architecture
**Date**: June 5, 2025
**Status**: Decided
**Decision**: Modular tool system with external API integrations

**Context**: 
Need to integrate multiple external services (web search, GitHub, Gmail) in a scalable and maintainable way.

**Decision**: 
Implement a modular tool system using LangChain's tool decorator pattern.

**Tool Strategy**:
- **Web Search**: Tavily API for real-time search with good rate limits
- **GitHub**: GitHub API with fine-grained personal access tokens
- **Gmail**: Gmail API with OAuth 2.0 for user consent
- **File Handling**: Local processing with cloud storage for persistence
- **Code Execution**: Sandboxed execution using Docker containers

**Security Measures**:
- API key management through environment variables
- User permission system for tool access
- Sandboxed execution for code tools
- Rate limiting and usage monitoring

**Consequences**:
- ✅ Clean separation of concerns
- ✅ Easy to add new tools
- ✅ Secure API key management
- ✅ Scalable architecture
- ❌ External API dependencies
- ❌ Complex permission management

---

## Template for New ADRs
```markdown
## ADR-XXX: [Title]
**Date**: [Date]
**Status**: [Proposed/Decided/Deprecated/Superseded]
**Decision**: [Brief statement of decision]

**Context**: 
[Why this decision is needed]

**Decision**: 
[What was decided and key details]

**Consequences**:
- ✅ Positive consequence
- ❌ Negative consequence
```
