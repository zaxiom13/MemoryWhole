# GitHub Copilot Development Guidelines for MemoryWhole

## Project Overview

MemoryWhole is a React-based memory training application built with modern web technologies. This document outlines best practices and guidelines for development with GitHub Copilot to maintain code quality, consistency, and testability.

## Tech Stack

- **Frontend**: React 19.0.0, Framer Motion, Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Build**: React Scripts (Create React App)
- **Linting**: ESLint
- **Code Style**: Functional programming, clean architecture

## Core Development Principles

### 1. Unit Testing Philosophy ⭐

**Write unit tests - make them atomic, functional, and focused**

- **Atomic Tests**: Each test should test one specific behavior or function
- **Test First**: Write tests before or alongside implementation
- **Focused Scope**: Test one thing at a time, mock dependencies
- **Clear Naming**: Use descriptive test names that explain what is being tested

```javascript
// ✅ Good - Atomic and focused
describe('isInputCorrect', () => {
  it('returns true for matching input', () => {
    expect(isInputCorrect('Hello', 'Hello World')).toBe(true);
  });

  it('returns false for non-matching input', () => {
    expect(isInputCorrect('Hallo', 'Hello World')).toBe(false);
  });
});

// ❌ Bad - Testing multiple behaviors
it('handles all input scenarios', () => {
  expect(isInputCorrect('Hello', 'Hello World')).toBe(true);
  expect(isInputCorrect('Hallo', 'Hello World')).toBe(false);
  expect(isInputCorrect('', 'Hello World')).toBe(true);
});
```

### 2. Code Quality Standards

**Make code functional, readable, high-level, clean and solid**

#### Functional Programming
- Prefer pure functions without side effects
- Use immutable data structures
- Avoid mutation, return new objects/arrays
- Utilize React hooks for state management

```javascript
// ✅ Good - Pure function, immutable
const updateCard = (card, updates) => ({
  ...card,
  ...updates,
  updatedAt: Date.now()
});

// ❌ Bad - Mutates input
const updateCard = (card, updates) => {
  card.title = updates.title;
  card.updatedAt = Date.now();
  return card;
};
```

#### Clean and Readable Code
- Use descriptive variable and function names
- Keep functions small and single-purpose
- Add comments only when necessary to explain "why", not "what"
- Use consistent naming conventions (camelCase for JS, PascalCase for components)

#### High-Level Design
- Abstract complex logic into utility functions
- Use custom hooks for reusable stateful logic
- Implement proper separation of concerns
- Follow SOLID principles

### 3. Architecture: Hub and Spoke Pattern

**Organize code using hub and spoke architecture with proper file/folder structure**

#### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers (hubs)
├── features/           # Feature-based modules (spokes)
│   ├── typing/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.js
│   ├── statistics/
│   └── completion/
├── hooks/              # Shared custom hooks
├── models/             # Data models and business logic
├── routes/             # Route components
├── utils/              # Pure utility functions
└── ui/                 # Basic UI components
```

#### Hub and Spoke Guidelines
- **Hubs**: Contexts manage global state and coordinate between features
- **Spokes**: Features are self-contained modules with their own components, hooks, and logic
- **Clean Interfaces**: Features communicate through well-defined props and context APIs
- **Minimal Coupling**: Each feature should be independently testable and replaceable

### 4. File and Folder Organization

**Break things up into more files and folders as needed**

#### When to Create New Files
- Single Responsibility: One component/hook/utility per file
- File size: Keep files under 200 lines when possible
- Logical grouping: Related functionality should be grouped together
- Reusability: Extract reusable logic into separate modules

#### Naming Conventions
- Components: `PascalCase.js` (e.g., `CardList.js`)
- Hooks: `camelCase.js` starting with 'use' (e.g., `useTyping.js`)
- Utils: `camelCase.js` (e.g., `memoryUtils.js`)
- Tests: `fileName.test.js` (co-located with source files)
- Index files: Export public APIs from directories

#### Directory Guidelines
```javascript
// ✅ Good structure
features/
  typing/
    components/
      ReferenceTyping.js
      ReferenceConfirmation.js
    hooks/
      useTyping.js
      useTypingUI.js
    utils/
      typingUtils.js
    index.js              // Public API exports

// ❌ Bad - everything in one place
components/
  ReferenceTyping.js
  ReferenceConfirmation.js
  useTyping.js
  typingUtils.js
```

## Development Workflow

### Test-Driven Development

**Run tests and fix them before each commit**

1. **Before coding**: Write failing tests for new features
2. **While coding**: Run tests frequently (`npm test`)
3. **Before committing**: Ensure all tests pass
4. **Quality gates**: Build must pass (`npm run build`)

```bash
# Development workflow
npm test -- --coverage --watchAll=false  # Run all tests
npm run build                            # Verify build works
git add .
git commit -m "descriptive message"
```

### Testing Patterns

#### Model Testing
```javascript
// Test data models thoroughly
describe('Card', () => {
  describe('constructor', () => {
    it('creates card with required properties', () => {
      const card = new Card({ title: 'Test', text: 'Content' });
      expect(card.title).toBe('Test');
      expect(card.createdAt).toBeInstanceOf(Number);
    });
  });
});
```

#### Hook Testing
```javascript
// Test custom hooks with renderHook
import { renderHook, act } from '@testing-library/react';

describe('useTyping', () => {
  it('updates input correctly', () => {
    const { result } = renderHook(() => useTyping());
    
    act(() => {
      result.current.handleInputChange('test');
    });
    
    expect(result.current.userInput).toBe('test');
  });
});
```

#### Utility Testing
```javascript
// Test utilities with edge cases
describe('typingUtils', () => {
  describe('isInputCorrect', () => {
    it('handles empty strings', () => {
      expect(isInputCorrect('', 'reference')).toBe(true);
    });
    
    it('respects case sensitivity', () => {
      expect(isInputCorrect('hello', 'Hello')).toBe(false);
    });
  });
});
```

## React-Specific Guidelines

### Component Design
- Keep components small and focused (< 100 lines)
- Use functional components with hooks
- Implement proper prop validation
- Use React.memo for performance optimization when needed

### State Management
- Use local state (useState) for component-specific state
- Use context for shared state across multiple components
- Use custom hooks for complex stateful logic
- Avoid prop drilling - lift state to appropriate level

### Styling with Tailwind
- Use utility classes for styling
- Create reusable component classes when needed
- Maintain responsive design principles
- Use dark mode considerations (`dark:` prefixes)

## Performance Considerations

- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Avoid creating objects/functions in render
- Use useMemo and useCallback judiciously
- Test performance with React DevTools Profiler

## Code Review Guidelines

When reviewing code or generating suggestions:

1. **Correctness**: Does it work as intended?
2. **Testability**: Can it be easily tested?
3. **Readability**: Is it clear and self-documenting?
4. **Performance**: Are there obvious performance issues?
5. **Architecture**: Does it fit the established patterns?
6. **Security**: Are there any security concerns?

## Error Handling

- Use try-catch blocks for async operations
- Provide meaningful error messages
- Implement error boundaries for React components
- Log errors appropriately (console.error in development)
- Handle edge cases gracefully

## Documentation

- Write clear commit messages following conventional commits
- Document complex algorithms or business logic
- Keep README.md updated with setup and usage instructions
- Use JSDoc comments for public APIs when beneficial

---

*Remember: The goal is to write code that is easy to understand, test, and maintain. When in doubt, favor simplicity and clarity over cleverness.*