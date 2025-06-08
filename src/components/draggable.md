# Draggable Component

The `Draggable` component provides an easy way to implement drag-and-drop reordering functionality in your React applications. This component allows users to drag items in a list and reorder them with visual feedback.

## Features

- Drag and drop reordering
- Visual feedback during dragging
- Insertion point indicators
- Keyboard accessibility (planned)
- Automatic context handling

## Usage

```tsx
import { DragProvider } from './components/drag-context';
import { Dragable } from './components/draggable';

function MyList() {
  const [items, setItems] = React.useState(myItems);
  
  return (
    <DragProvider
      onReorder={(move) => {
        const newItems = [...items];
        const [movedItem] = newItems.splice(move.sourceIndex, 1);
        newItems.splice(move.targetIndex, 0, movedItem);
        setItems(newItems);
      }}
    >
      {items.map((item, index) => (
        <Dragable key={item.id} index={index} maxIndex={items.length}>
          <YourItemComponent item={item} />
        </Dragable>
      ))}
    </DragProvider>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `index` | `number` | The index of the item in the list |
| `maxIndex` | `number` | The total number of items in the list |
| `children` | `React.ReactNode` | The content to be made draggable |

## DragProvider Props

The `Dragable` component must be wrapped in a `DragProvider` component, which accepts the following props:

| Prop | Type | Description |
|------|------|-------------|
| `onReorder` | `(move: { sourceIndex: number, targetIndex: number }) => void` | Callback function called when items are reordered |
| `children` | `React.ReactNode` | The draggable items to render |

## Visual Feedback

- When dragging an item, it will display a subtle shadow effect
- A blue line indicator shows where the item will be placed when dropped
- The insertion point updates in real-time as you drag over different positions

## Best Practices

1. Always provide unique `key` props for each `Dragable` component
2. Wrap your draggable items in a single `DragProvider`
3. Implement the `onReorder` callback to handle state updates
4. Keep draggable content lightweight for smooth performance

## Example with Styling

```tsx
function MyItem({ item }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '4px',
      minWidth: '100px',
      backgroundColor: 'white'
    }}>
      {item.name}
    </div>
  );
}
```

The component automatically handles drag and drop events and provides visual feedback, making it easy to implement drag-and-drop reordering in your application.
