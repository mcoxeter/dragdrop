# Global Rules for React Component Development

## Core Principles

1. **Readability First**

   - Write code that a junior programmer can understand
   - Include clear comments explaining complex logic
   - Use descriptive variable and function names
   - Break complex operations into well-named helper functions

2. **Component Structure**

   - Use function components exclusively
   - Keep components focused and short (aim for under 100 lines)
   - Break large components into smaller, reusable sub-components
   - One component per file

3. **TypeScript Usage**

   - Define explicit interface/type for component props
   - Avoid using `any` type
   - Use meaningful type names
   - Prefer using type over interface
   - Export types/interfaces that might be reused
   - Example:

     ```tsx
     interface ButtonProps {
       label: string;
       onClick: () => void;
       variant?: 'primary' | 'secondary';
     }

     export function Button({
       label,
       onClick,
       variant = 'primary'
     }: ButtonProps) {
       // Component implementation
     }
     ```

4. **State Management**

   - Keep state as local as possible
   - Use appropriate hooks for state management:
     - `useState` for simple local state
     - `useReducer` for complex local state
     - Context for shared state
   - Document state updates with comments when logic is complex

5. **Component Organization**

   ```tsx
   // 1. Imports
   import React from 'react';

   // 2. Types/Interfaces
   interface Props {...}

   // 3. Helper functions/constants
   const helperFunction = () => {...}

   // 4. Component
   export function ComponentName({...}: Props) {
     // 4.1 Hooks (in consistent order)
     // 4.2 Derived state
     // 4.3 Event handlers
     // 4.4 Render helpers
     // 4.5 Return JSX
   }
   ```

6. **Props Guidelines**

   - Use destructuring for props
   - Provide default values when appropriate
   - Document required vs optional props in types
   - Keep props focused and minimal

7. **Event Handling**

   - Use proper event types from React
   - Name handlers with 'handle' prefix
   - Define handlers inside component (unless shared)
   - Example:
     ```tsx
     const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
       // Handler implementation
     };
     ```

8. **CSS/Styling**

   - Use CSS Modules for component-specific styles
   - Follow BEM-like naming conventions
   - Keep styles modular and scoped to component
   - Use semantic class names

9. **Performance Considerations**

   - Memoize callbacks with useCallback when passed as props
   - Memoize expensive computations with useMemo
   - Use React.memo for pure components that receive props frequently
   - Avoid unnecessary re-renders

10. **Error Handling**

    - Implement error boundaries where appropriate
    - Handle edge cases explicitly
    - Provide meaningful error messages
    - Use try-catch for async operations

11. **Testing Considerations**

    - Write components with testing in mind
    - Keep rendering logic pure when possible
    - Provide data-testid attributes when needed
    - Example:
      ```tsx
      <button data-testid='submit-button' onClick={handleSubmit}>
        Submit
      </button>
      ```

12. **Documentation**

    - Add JSDoc comments for component props
    - Document complex logic or business rules
    - Include usage examples in component docs
    - Example:
      ```tsx
      /**
       * Button component with different variants
       * @param {ButtonProps} props - The component props
       * @returns {JSX.Element} The rendered button
       */
      ```

13. **I18n**
    - All text strings used in components should be possible to provide via props, they should have sensible defaults if not provided.

## Example Component Structure

```tsx
import React from 'react';
import styles from './Component.module.scss';

interface ComponentProps {
  /** Description of title prop */
  title: string;
  /** Description of onAction prop */
  onAction: () => void;
}

/**
 * Component description
 */
export function Component({ title, onAction }: ComponentProps) {
  // Hooks
  const [isActive, setIsActive] = React.useState(false);

  // Event handlers
  const handleClick = React.useCallback(() => {
    setIsActive(true);
    onAction();
  }, [onAction]);

  // JSX
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handleClick}
        data-testid='component-button'
      >
        <div className={styles.content}>{title}</div>
      </button>
    </div>
  );
}
```

## Anti-patterns to Avoid

1. ❌ Using class components
2. ❌ Mixing business logic with UI
3. ❌ Deep prop drilling (use Context instead)
4. ❌ Inline styles (except for dynamic values)
5. ❌ Large, monolithic components
6. ❌ Unclear prop names
7. ❌ Unnecessary state
8. ❌ Direct DOM manipulation
9. ❌ Using render methods, when a componment can be made instead.
