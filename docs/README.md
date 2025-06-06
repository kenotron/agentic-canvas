# Agentic Canvas - Claude Clone Project

## Overview
This project aims to create a Claude-like AI assistant interface using React Router 7, TypeScript, and Tailwind CSS.

## Project Structure
```
agentic-canvas/
├── app/                    # React Router application
│   ├── routes/            # Application routes
│   └── welcome/           # Welcome component
├── docs/                  # Project documentation
│   ├── README.md          # This file
│   ├── development-log.md # Development history
│   ├── architecture-decisions.md # Technical decisions
│   └── backend-architecture.md   # LLM server documentation
├── aspire/               # .NET Aspire orchestration
├── servers/              # Backend services
│   └── llm-server/       # LLM server implementation
└── public/               # Static assets
```

## Tech Stack
- **Frontend**: React 19, React Router 7, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: FastAPI + LiteLLM + LangGraph
  - **API Compatibility**: 100% OpenAI API compatible via LiteLLM
  - **Agent Framework**: LangGraph for advanced workflows
  - **Tools**: Web search, GitHub, Gmail, file handling
- **LLM Providers**: Claude (Anthropic), GPT (OpenAI), and others via LiteLLM
- **Orchestration**: .NET Aspire
- **Containerization**: Docker

## Development Log
All development actions and decisions are documented in the [Development Log](./development-log.md).

## Getting Started
1. Install dependencies: `pnpm install`
2. Start development server: `pnpm dev`
3. Open browser to `http://localhost:3000`

## Goals
- [x] Create documentation structure
- [x] Research and design backend architecture
- [ ] Implement OpenAI-compatible API with LiteLLM
- [ ] Create agent framework with LangGraph
- [ ] Integrate web search, GitHub, and Gmail tools
- [ ] Create a chat interface similar to Claude
- [ ] Implement message history and streaming
- [ ] Add typing indicators and real-time features
- [ ] Add file upload capabilities
- [ ] Implement conversation management
- [ ] Add user authentication
- [ ] Deploy to Azure

## Architecture Decisions
See [Architecture Decisions](./architecture-decisions.md) for detailed technical decisions and rationale.
