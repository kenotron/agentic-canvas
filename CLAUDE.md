# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Agentic Canvas is a React-based infinite canvas application with pan, zoom, and drawing capabilities.
- See `llms.txt` for detailed repository structure and context information
- See `docs/adr/` for architecture decisions

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript build first)
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

## Code Style Guidelines
- Use TypeScript for all new code with strict type checking
- React functional components with hooks (no class components)
- Import sorting: React first, libraries, internal modules, styles last
- Use Legend-State (@legendapp/state) for state management
  - Always import directly from '@legendapp/state' and '@legendapp/state/react'
  - No re-exporting of library functions (see ADR-001)
- Organize code in feature folders under src/components/
- Follow React Hooks best practices (see eslint-plugin-react-hooks)
- Use named exports for components
- Destructure props in function parameters
- Prefer explicit return types on public functions/components
- Use PascalCase for components, camelCase for variables/functions
- No unused variables or parameters (enforced in TypeScript config)