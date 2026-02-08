# Bot-Scraper Developer Guidelines

This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
Instruction.md
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="Instruction.md">
You are a very strong reasoner and planner. Use these critical instructions to structure your plans, thoughts, and responses.

Before taking any action (either tool calls *or* responses to the user), you must proactively, methodically, and independently plan and reason about:

1) Logical dependencies and constraints: Analyze the intended action against the following factors. Resolve conflicts in order of importance:
    1.1) Policy-based rules, mandatory prerequisites, and constraints.
    1.2) Order of operations: Ensure taking an action does not prevent a subsequent necessary action.
        1.2.1) The user may request actions in a random order, but you may need to reorder operations to maximize successful completion of the task.
    1.3) Other prerequisites (information and/or actions needed).
    1.4) Explicit user constraints or preferences.

2) Risk assessment: What are the consequences of taking the action? Will the new state cause any future issues?
    2.1) For exploratory tasks (like searches), missing *optional* parameters is a LOW risk. **Prefer calling the tool with the available information over asking the user, unless** your `Rule 1` (Logical Dependencies) reasoning determines that optional information is required for a later step in your plan.

3) Abductive reasoning and hypothesis exploration: At each step, identify the most logical and likely reason for any problem encountered.
    3.1) Look beyond immediate or obvious causes. The most likely reason may not be the simplest and may require deeper inference.
    3.2) Hypotheses may require additional research. Each hypothesis may take multiple steps to test.
    3.3) Prioritize hypotheses based on likelihood, but do not discard less likely ones prematurely. A low-probability event may still be the root cause.

4) Outcome evaluation and adaptability: Does the previous observation require any changes to your plan?
    4.1) If your initial hypotheses are disproven, actively generate new ones based on the gathered information.

5) Information availability: Incorporate all applicable and alternative sources of information, including:
    5.1) Using available tools and their capabilities
    5.2) All policies, rules, checklists, and constraints
    5.3) Previous observations and conversation history
    5.4) Information only available by asking the user

6) Precision and Grounding: Ensure your reasoning is extremely precise and relevant to each exact ongoing situation.
    6.1) Verify your claims by quoting the exact applicable information (including policies) when referring to them. 

7) Completeness: Ensure that all requirements, constraints, options, and preferences are exhaustively incorporated into your plan.
    7.1) Resolve conflicts using the order of importance in #1.
    7.2) Avoid premature conclusions: There may be multiple relevant options for a given situation.
        7.2.1) To check for whether an option is relevant, reason about all information sources from #5.
        7.2.2) You may need to consult the user to even know whether something is applicable. Do not assume it is not applicable without checking.
    7.3) Review applicable sources of information from #5 to confirm which are relevant to the current state.

8) Persistence and patience: Do not give up unless all the reasoning above is exhausted.
    8.1) Don't be dissuaded by time taken or user frustration.
    8.2) This persistence must be intelligent: On *transient* errors (e.g. please try again), you *must* retry **unless an explicit retry limit (e.g., max x tries) has been reached**. If such a limit is hit, you *must* stop. On *other* errors, you must change your strategy or arguments, not repeat the same failed call.

9) Inhibit your response: only take an action after all the above reasoning is completed. Once you've taken an action, you cannot take it back.
</file>

</files>


## Project Structure

Monorepo with three main packages:
- `/backend` - NestJS API server
- `/frontend` - React + Vite + TypeScript + Fluent UI
- `/worker` - Local scraper worker (NestJS + Playwright)

## Build Commands

```bash
# Backend (NestJS)
cd backend && npm run build          # Production build
cd backend && npm run start:dev      # Development with hot reload

# Frontend (Vite + React)
cd frontend && npm run build         # Production build
cd frontend && npm run dev           # Development server

# Worker (NestJS)
cd worker && npm run build
```

## Lint Commands

```bash
# All projects use ESLint
cd backend && npm run lint           # Auto-fix enabled
cd frontend && npm run lint
cd worker && npm run lint
```

## Test Commands

```bash
# Backend
npm run test                        # Run all tests
npm run test:watch                  # Watch mode
npm run test:cov                    # Coverage report
npm run test:e2e                    # End-to-end tests

# Run single test file (any package)
npm test -- workers.controller.spec.ts
npm test -- --testNamePattern="should register worker"

# Worker
npm test
npm run test:watch
```

## Code Style Guidelines

### TypeScript/React

**Imports Order:**
1. React/NestJS imports
2. Third-party libraries (grouped by library)
3. Internal imports (absolute paths with aliases)
4. Relative imports (siblings last)

```typescript
import { Controller, Get } from '@nestjs/common';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { WorkerCard } from './WorkerCard';
```

**Formatting:**
- Indent: 2 spaces
- Max line length: 100
- Trailing commas: always
- Semicolons: required
- Single quotes

**Types:**
- Use strict TypeScript
- Prefer `interface` over `type` for objects
- Use explicit return types on public methods
- Export types from dedicated files (`types.ts`, `dto/`)

```typescript
export interface LocalWorker {
  id: string;
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'BLOCKED';
}
```

### Naming Conventions

- **Files**: PascalCase for components (`WorkerCard.tsx`), camelCase for utilities
- **Components**: PascalCase (`WorkerCard`, `TaskQueue`)
- **Hooks**: camelCase starting with `use` (`useWorkers`, `useTasks`)
- **Variables**: camelCase (except environment constants)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **CSS classes**: camelCase using Fluent UI's `makeStyles`

### Error Handling

**Backend:**
- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`)
- Log errors with context using `Logger`
- Return standardized error response format

**Frontend:**
- Handle API errors with try-catch in API layer
- Use `useToast` hook for user-facing errors
- Intercept errors in Axios interceptor (`lib/api.ts`)

### Architecture Patterns

**Backend (NestJS):**
- Feature-based folder structure (`modules/workers/`)
- Controllers handle HTTP layer
- Services contain business logic
- DTOs for input validation (class-validator)
- Use dependency injection

**Frontend (React):**
- Feature-based folders (`features/workers/`)
- Container/Presentational pattern
- Custom hooks for data fetching (React Query)
- API layer separate from components (`lib/api.ts`)

### Git Conventions

- Write clear commit messages in English
- Use present tense ("Add feature" not "Added feature")
- Reference issues when applicable
- Run lint before committing

### Testing Standards

- Use descriptive test names
- Group related tests in `describe` blocks
- Mock external dependencies
- E2E tests for critical user flows
- Unit tests for business logic

### Database (Prisma)

- Schema changes require migration
- Use Prisma Client for queries
- Seed data in `prisma/seed.ts`

### Environment Variables

- Use `.env` files (never commit secrets)
- Document all env vars in README
- Validate env vars at startup

---

## Active Technologies
- TypeScript 5.9.3 (strict mode) + React 19.2.0, Fluent UI React Components 9.72.11, TanStack React Query 5.90.20, React Router DOM 7.13.0, Axios 1.13.4, Vite 7.2.4 (020-frontend-refactor)
- N/A (frontend consome API NestJS backend) (020-frontend-refactor)

- TypeScript 5.x + React 18.x + Fluent UI (019-frontend-refactor)
- Vite + React Query + Axios (019-frontend-refactor)

## Recent Changes

- 019-frontend-refactor: Added custom hooks (useForm, useModal, useEntityApi) and reusable components (FormModal, FormSection, CardSkeleton, StatusBadge)
- 019-frontend-refactor: Target 15% LoC reduction through component abstraction

**Last updated**: 2026-02-08
