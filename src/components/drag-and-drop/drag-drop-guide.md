# Draggable Component Developer Guide

## Overview

The Draggable component is a React component that enables drag-and-drop functionality in lists. It's built with TypeScript and follows accessibility best practices. This guide will help you understand how it works and how to use it.

## Component Architecture

### Core Components

1. **Draggable** (`draggable.tsx`)

   - Main component that manages drag-and-drop logic
   - Handles keyboard interactions
   - Manages accessibility announcements

2. **DraggableItem** (`draggable-item.tsx`)

   - Renders the draggable element
   - Handles visual states and styling
   - Manages DOM events

3. **DragContext** (`drag-context.tsx`)
   - Provides state management across components
   - Tracks drag operation state
   - Handles reordering logic

## State Management

The component uses React Context to manage drag state. Key state elements:

```typescript
type Reorder = {
  sourceIndex: number; // Index of item being dragged
  targetIndex: number; // Index where item will be dropped
  targetSide?: 'before' | 'after'; // Drop position relative to target
};
```

State is derived from context rather than maintained locally:

- `isDragging`: Determined by `context.reorder?.sourceIndex === index`
- `isOver`: Determined by `context.reorder?.targetIndex === index`

## Event Flow

1. **Starting a Drag**

   ```typescript
   const startDragging = () => {
     context.setReorder({ sourceIndex: index, targetIndex: index });
   };
   ```

2. **During Drag**

   - Mouse movement triggers `handleDragOver`
   - Updates target position and side
   - Provides visual feedback

3. **Dropping**
   ```typescript
   const commitReorder = () => {
     if (reorder?.sourceIndex !== reorder?.targetIndex) {
       context.onReorder?.({
         sourceIndex: reorder.sourceIndex,
         targetIndex: reorder.targetIndex
       });
     }
     context.setReorder(undefined);
   };
   ```

## Accessibility Features

1. **Keyboard Navigation**

   - Space/Enter: Start/end dragging
   - Arrow keys: Move item while dragging
   - Escape: Cancel drag operation

2. **Screen Reader Support**
   - Announces drag operations
   - Provides position feedback
   - Includes status updates

## Visual Feedback

CSS classes provide visual states:

- `.dragging`: Applied when item is being dragged
- `.over`: Applied when item is potential drop target
- `.over-before`/`.over-after`: Shows drop position

```scss
.dragging {
  opacity: 0.8;
  cursor: grabbing;
  z-index: 1001;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

## Usage Example

```tsx
function MyList() {
  const [items, setItems] = useState(initialItems);

  return (
    <DragProvider
      onReorder={({ sourceIndex, targetIndex }) => {
        const newItems = [...items];
        const [moved] = newItems.splice(sourceIndex, 1);
        newItems.splice(targetIndex, 0, moved);
        setItems(newItems);
      }}
    >
      {items.map((item, index) => (
        <Draggable key={item.id} index={index} maxIndex={items.length}>
          {item.content}
        </Draggable>
      ))}
    </DragProvider>
  );
}
```

## Important Tips

1. **Performance**

   - State updates are batched through context
   - Visual updates use CSS transforms
   - Event handlers are memoized

2. **Customization**

   - Custom text strings via `texts` prop
   - Styling through CSS variables
   - Optional drag handles

3. **Common Gotchas**
   - Always provide unique `key` props
   - Keep list items lightweight
   - Handle disabled state appropriately

## Debugging Tips

1. **Visual States**

   - Check `.dragging` class for drag state
   - Verify `.over` class for drop targets
   - Inspect drop indicators

2. **State Issues**

   - Check context value in React DevTools
   - Verify index props are correct
   - Confirm event handler dependencies

3. **Accessibility Issues**
   - Test with keyboard navigation
   - Verify screen reader announcements
   - Check ARIA attributes

## Best Practices

1. **Component Structure**

   - Keep items small and focused
   - Avoid complex state in draggable children
   - Use memoization for expensive content

2. **Event Handling**

   - Don't stop event propagation
   - Handle errors in reorder callback
   - Validate indices before reordering

3. **Accessibility**
   - Maintain keyboard focus during reorder
   - Provide meaningful labels
   - Test with screen readers

## Further Reading

1. Review the test files in `__tests__/` for usage examples
2. Check `draggable.requirements.md` for component specifications
3. See `tasks.md` for upcoming features and improvements

Remember: The component uses the context to maintain a single source of truth for drag state, making it easier to reason about and debug drag operations.
