/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export type targetSideType = 'before' | 'after';

export type MoveDirectionType = 'up' | 'down';

export type InsertType = 'insert-before' | 'insert-after' | 'cant-insert-here';

export type DragContextType = {
  applyDrop(): void;
  applyDragStart(dragIndex: number): void;
  applyDragOver(dragOverIndex: number, side?: targetSideType): void;
  cancelDrag(): void;
  isDragItem(listIndex: number): boolean;
  moveDragItem(direction: MoveDirectionType): void;
  getDropInsertPosition(listIndex: number): InsertType;
  getNumberOfItems(): number;
};

const DragContext = React.createContext<DragContextType | null>(null);

export function useDragContext() {
  const context = React.useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context;
}

export type DragProviderProps = {
  children: React.ReactNode;
  items: any[]; // Replace with your actual item type
  setItems: React.Dispatch<React.SetStateAction<any[]>>; // Replace with your actual item type
};

export type ItemOrder = {
  index: number;
  order: number;
};

export type DragOperation = {
  dragIndex: number;
};

export type DragOverOperation = {
  dragOverIndex: number;
  newOrder: number;
};
export function DragProvider({ children, items, setItems }: DragProviderProps) {
  const [dragOperation, setDragOperation] =
    React.useState<DragOperation | null>(null);

  const [dragOverOperation, setDragOverOperation] =
    React.useState<DragOverOperation | null>(null);
  const [itemOrders, setItemOrders] = React.useState<ItemOrder[]>([]);

  const applyDragStart = (dragIndex: number): void => {
    setDragOperation({ dragIndex });
  };

  const applyDragOver = (
    dragOverIndex: number,
    side?: targetSideType
  ): void => {
    const newDragOverOperation: DragOverOperation = {
      dragOverIndex,
      newOrder:
        side === 'before'
          ? itemOrders[dragOverIndex].order - 1
          : itemOrders[dragOverIndex].order + 1
    };
    if (
      newDragOverOperation.dragOverIndex !==
        (dragOperation?.dragIndex ?? -100) &&
      newDragOverOperation.newOrder !== (dragOverOperation?.newOrder ?? -100)
    ) {
      setDragOverOperation(newDragOverOperation);
    }
  };

  const applyDrop = (): void => {
    if (dragOperation && dragOverOperation) {
      // Update the item in items order based on the dragOverOperation.
      const copy = [...itemOrders];
      copy[dragOperation.dragIndex].order = dragOverOperation.newOrder;

      // Sort the itemOrders.
      copy.sort((a, b) => a.order - b.order);
      setItemOrders(copy);
      // Create a new Items array ordered by itemOrders.
      const newItems = copy.map((itemOrder) => items[itemOrder.index]);
      // Set new the Items array to the state.
      setItems(newItems);
      // Reset the drag operations.
      setDragOperation(null);
      setDragOverOperation(null);
    }
  };

  const cancelDrag = (): void => {
    setDragOperation(null);
    setDragOverOperation(null);
  };

  const moveDragItem = (direction: MoveDirectionType): void => {
    if (!dragOperation) return;

    const currentIndex = dragOperation.dragIndex;
    const dragOverIndex =
      direction === 'up'
        ? Math.max(0, currentIndex - 1)
        : Math.min(items.length - 1, currentIndex + 1);

    if (dragOverIndex !== currentIndex) {
      setDragOverOperation({
        dragOverIndex,
        newOrder:
          direction === 'up'
            ? itemOrders[dragOverIndex].order - 1
            : itemOrders[dragOverIndex].order + 1
      });
    }
  };

  const isDragItem = (listIndex: number): boolean => {
    return (dragOperation?.dragIndex ?? -1) === listIndex;
  };

  const getDropInsertPosition = (listIndex: number): InsertType => {
    if (!dragOverOperation) {
      return 'cant-insert-here';
    }
    if (dragOverOperation.dragOverIndex !== listIndex) {
      return 'cant-insert-here';
    }
    return dragOverOperation.newOrder < itemOrders[listIndex].order
      ? 'insert-before'
      : 'insert-after';
  };

  const getNumberOfItems = (): number => {
    return items.length;
  };

  React.useEffect(() => {
    const initialOrders = items.map((_, index) => ({
      index,
      order: index * 2 + 1
    }));
    setItemOrders(initialOrders);
  }, [items]);

  return (
    <DragContext.Provider
      value={{
        applyDragStart,
        applyDragOver,
        applyDrop,
        cancelDrag,
        isDragItem,
        moveDragItem,
        getDropInsertPosition,
        getNumberOfItems
      }}
    >
      {children}
    </DragContext.Provider>
  );
}
