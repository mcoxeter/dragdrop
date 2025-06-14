/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  createDragOperation,
  createDragOverOperation,
  canDragOver,
  updateDraggedItemsSortValueInItemOrders,
  reorderItems,
  keyboardMoveDragItem,
  isDraggingItem,
  getDropPosition,
  createInitialOrders
} from './drag-drop-logic';

// export type MoveDirectionType = 'up' | 'down';

export type InsertType = 'insert-before' | 'insert-after' | 'cant-insert-here';

export type DragContextType = {
  applyDrop(): void;
  applyDragStart(dragIndex: number): void;
  applyDragOver(dragOverIndex: number, side?: InsertType): void;
  cancelDrag(): void;
  isDragItem(listIndex: number): boolean;
  moveDragItem(direction: InsertType): void;
  getDropInsertPosition(listIndex: number): InsertType;
  getNumberOfItems(): number;
  // getDragItemInfo
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
  side: InsertType;
};
export function DragProvider({ children, items, setItems }: DragProviderProps) {
  const [dragOperation, setDragOperation] =
    React.useState<DragOperation | null>(null);
  const [dragOverOperation, setDragOverOperation] =
    React.useState<DragOverOperation | null>(null);
  const [itemOrders, setItemOrders] = React.useState<ItemOrder[]>([]);

  const applyDragStart = (dragIndex: number): void => {
    setDragOperation(createDragOperation(dragIndex));
  };

  const applyDragOver = (dragOverIndex: number, side: InsertType): void => {
    const newDragOverOperation = createDragOverOperation(
      dragOverIndex,
      itemOrders,
      side
    );
    if (canDragOver(newDragOverOperation, dragOperation, dragOverOperation)) {
      setDragOverOperation(newDragOverOperation);
    }
  };

  const applyDrop = (): void => {
    if (dragOperation && dragOverOperation) {
      const newOrders = updateDraggedItemsSortValueInItemOrders(
        itemOrders,
        dragOperation.dragIndex,
        dragOverOperation.newOrder
      );
      setItemOrders(newOrders);
      setItems(reorderItems(items, newOrders));
      setDragOperation(null);
      setDragOverOperation(null);
    }
  };

  const cancelDrag = (): void => {
    setDragOperation(null);
    setDragOverOperation(null);
  };

  const moveDragItem = (direction: InsertType): void => {
    if (!dragOperation) return;

    const currentIndex =
      dragOverOperation?.dragOverIndex ?? dragOperation.dragIndex;

    const newDragOverOp = keyboardMoveDragItem(
      direction,
      currentIndex,
      itemOrders,
      items.length - 1
    );

    if (newDragOverOp) {
      setDragOverOperation(newDragOverOp);
    }
  };

  const isDragItem = (listIndex: number): boolean => {
    return isDraggingItem(listIndex, dragOperation);
  };

  const getDropInsertPosition = (listIndex: number): InsertType => {
    return getDropPosition(listIndex, dragOverOperation, itemOrders);
  };

  const getNumberOfItems = (): number => {
    return items.length;
  };

  React.useEffect(() => {
    setItemOrders(createInitialOrders(items));
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
