import React from 'react';
import './App.css';
import { DragProvider } from './components/drag-and-drop/drag-context';
import { Draggable } from './components/drag-and-drop/draggable';
import { ScreenReaderAnnouncements } from './components/drag-and-drop/screen-reader-announcements';

function App() {
  const [items, setItems] = React.useState<Item[]>(getItems());
  return (
    <DragProvider items={items} setItems={setItems}>
      <ScreenReaderAnnouncements />
      {items.map((item, index) => (
        <Draggable key={item.id} indexInList={index} maxIndex={items.length}>
          <MyItem item={item} />
        </Draggable>
      ))}
      {/* <Diasnostics /> */}
    </DragProvider>
  );
}

function MyItem({ item }: { item: Item }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '4px',
        minWidth: '100px',
        backgroundColor: 'white'
      }}
    >
      {item.name}
    </div>
  );
}

type Item = {
  id: string;
  name: string;
};

const getItems = (): Item[] => {
  return [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
    { id: '4', name: 'Item 4' },
    { id: '5', name: 'Item 5' }
  ];
};

export default App;
