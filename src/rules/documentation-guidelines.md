# Documentation Guidelines

This document outlines the standard structure for component documentation in this project. Follow these guidelines to maintain consistency across all component documentation.

## Documentation Structure

Each component documentation should follow this structure:

1. **Component Title**

   - Use H1 (#) for the component name
   - Example: `# ComponentName`

2. **Overview**

   - A brief paragraph describing the component's purpose and main functionality
   - Should answer: What does this component do? Why would someone use it?

3. **Features Section**

   - List key features using bullet points
   - Include both implemented and planned features
   - Keep descriptions concise
   - Example:
     ```markdown
     ## Features

     - Feature one
     - Feature two
     ```

4. **Usage Section**

   - Include a practical example using TypeScript/TSX
   - Show the component in a realistic context
   - Include imports
   - Show basic state management if applicable
   - Example:
     ````markdown
     ## Usage

     ```tsx
     import { Component } from './components/component';
     // ... usage example code
     ```
     ````
     ```

     ```

5. **Props Documentation**

   - Use tables to document props
   - Include columns for: Prop name, Type, Description
   - Example:
     ```markdown
     ## Props

     | Prop       | Type   | Description             |
     | ---------- | ------ | ----------------------- |
     | `propName` | `type` | Description of the prop |
     ```

6. **Related Components/Context**

   - If the component requires wrapper components or context providers
   - Document their props in a separate section
   - Use the same table format as Props

7. **Visual Feedback/Behavior**

   - Document visual states and interactions
   - Use bullet points for different states/behaviors
   - Include descriptions of animations or transitions

8. **Best Practices**

   - Numbered list of implementation recommendations
   - Include performance considerations
   - Common pitfalls to avoid
   - Example:
     ```markdown
     ## Best Practices

     1. First best practice
     2. Second best practice
     ```

9. **Examples Section**
   - Include practical examples with common use cases
   - Show examples with styling if relevant
   - Use TypeScript/TSX for code examples

## Writing Style Guidelines

1. **Code References**

   - Use backticks (`) for component names, props, and code references
   - Example: The `ComponentName` accepts a `value` prop

2. **Code Blocks**

   - Use triple backticks with language specification
   - Example: ```tsx for TypeScript/React code

3. **Descriptions**

   - Write in clear, concise language
   - Use active voice
   - Focus on practical usage
   - Include enough detail to implement without being verbose

4. **Headers**
   - Use H1 (#) for component name
   - Use H2 (##) for main sections
   - Use H3 (###) for subsections if needed

## Markdown Formatting

1. **Lists**

   - Use hyphen (-) for unordered lists
   - Use numbers (1.) for ordered lists
   - Maintain consistent indentation

2. **Tables**

   - Use standard markdown tables
   - Align header row with hyphens
   - Include header separator row

3. **Code Examples**
   - Include language identifier with code blocks
   - Indent code properly
   - Include comments for complex logic

## File Organization

1. **File Location**

   - Save documentation in the same directory as the component
   - Use the naming format: `componentName.md`

2. **File Header**
   - Include file path comment at the top
   - Example: `<!-- filepath: src/components/componentName.md -->`

## Example Template

````markdown
# ComponentName

Brief description of the component and its main purpose.

## Features

- Feature one
- Feature two

## Usage

```tsx
// Usage example code
```
````

## Props

| Prop   | Type   | Description |
| ------ | ------ | ----------- |
| `prop` | `type` | Description |

## Best Practices

1. First practice
2. Second practice

## Examples

```tsx
// Example code
```

```

This documentation structure ensures consistency and completeness across all component documentation in the project.
```
