# Agent Guidelines for Super Task Manager

## Build/Lint/Test Commands

- **Build**: `npm run build` (or `turbo run build` from root)
- **Lint**: `npm run lint` (ESLint with max-warnings 0)
- **Type Check**: `npm run check-types` (TypeScript noEmit)
- **Test**: `npm run test` (Jest)
- **Test Watch**: `npm run test:watch` (Jest with --watch)
- **Single Test**: `npm test -- --testNamePattern="test name"` or `npm test path/to/test.test.ts`
- **Format**: `npm run format` (Prettier for .ts, .tsx, .md files)

## Code Style Guidelines

- **Imports**: Use explicit type imports (`import type { Task } from "@repo/types"`)
- **Types**: Prefer interfaces for object shapes, explicit return types for functions
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Error Handling**: Use try/catch for async operations, log errors with pino logger
- **Formatting**: 2-space indentation, trailing commas, double quotes for strings
- **Components**: Default exports for React components, CSS modules for styling
- **API**: Express Router pattern, proper HTTP status codes, structured logging
- **Testing**: Jest with Testing Library for React, descriptive test names
- **Module System**: ESM modules (type: "module"), .js extensions in relative imports
