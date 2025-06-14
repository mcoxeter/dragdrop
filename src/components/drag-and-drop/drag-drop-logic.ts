import type { DragOperation, DragOverOperation, ItemOrder, MoveDirectionType, targetSideType, InsertType } from './drag-context';

/**
 * Creates a drag operation for a given index
 */
export function createDragOperation(dragIndex: number): DragOperation {
  return { dragIndex };
}

/**
 * Creates a drag over operation based on current state and position
 */
export function createDragOverOperation(
  dragOverIndex: number,
  itemOrders: ItemOrder[],
  side?: targetSideType
): DragOverOperation {
  return {
    dragOverIndex,
    newOrder: side === 'before'
      ? itemOrders[dragOverIndex].order - 1
      : itemOrders[dragOverIndex].order + 1
  };
}

/**
 * Determines if drag over operation should be updated
 */
export function shouldUpdateDragOver(
  newOperation: DragOverOperation,
  currentDragOp: DragOperation | null,
  currentDragOverOp: DragOverOperation | null
): boolean {
  return newOperation.dragOverIndex !== (currentDragOp?.dragIndex ?? -100) &&
    newOperation.newOrder !== (currentDragOverOp?.newOrder ?? -100);
}

/**
 * Updates item orders based on drop operation
 */
export function updateItemOrders(
  dragOperation: DragOperation,
  dragOverOperation: DragOverOperation,
  itemOrders: ItemOrder[]
): ItemOrder[] {
  const copy = [...itemOrders];
  copy[dragOperation.dragIndex].order = dragOverOperation.newOrder;
  return copy.sort((a, b) => a.order - b.order);
}

/**
 * Reorders items based on item orders
 */
export function reorderItems<T>(items: T[], itemOrders: ItemOrder[]): T[] {
  return itemOrders.map(itemOrder => items[itemOrder.index]);
}

/**
 * Calculates new position when moving item up/down
 */
export function calculateMoveDragItem(
  direction: MoveDirectionType,
  currentIndex: number,
  itemOrders: ItemOrder[],
  maxIndex: number
): DragOverOperation | null {
  const dragOverIndex = direction === 'up'
    ? Math.max(0, currentIndex - 1)
    : Math.min(maxIndex, currentIndex + 1);

  if (dragOverIndex === currentIndex) {
    return null;
  }

  return {
    dragOverIndex,
    newOrder: direction === 'up'
      ? itemOrders[dragOverIndex].order - 1
      : itemOrders[dragOverIndex].order + 1
  };
}

/**
 * Checks if an item is currently being dragged
 */
export function isDraggingItem(listIndex: number, dragOp: DragOperation | null): boolean {
  return (dragOp?.dragIndex ?? -1) === listIndex;
}

/**
 * Determines drop position relative to a target item
 */
export function getDropPosition(
  listIndex: number,
  dragOverOp: DragOverOperation | null,
  itemOrders: ItemOrder[]
): InsertType {
  if (!dragOverOp || dragOverOp.dragOverIndex !== listIndex) {
    return 'cant-insert-here';
  }
  
  return dragOverOp.newOrder < itemOrders[listIndex].order
    ? 'insert-before'
    : 'insert-after';
}

/**
 * Creates initial item orders
 */
export function createInitialOrders(items: unknown[]): ItemOrder[] {
  return items.map((_, index) => ({
    index,
    order: index * 2 + 1
  }));
}
