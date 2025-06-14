import type {
  DragOperation,
  DragOverOperation,
  ItemOrder,
  MoveDirectionType,
  targetSideType,
  InsertType
} from './drag-context';

/**
 * Drag and Drop Logic Architecture
 * -------------------------------
 * This module implements a flexible drag-and-drop system using a dual-array approach with
 * numeric ordering for precise positioning control.
 *
 * Core Concepts:
 * 1. Item Orders Management
 *    - Client provides: items[] (source data array)
 *    - We maintain: itemOrders[] (index-to-order mapping)
 *    - Each ItemOrder: { index: number, order: number }
 *    - Orders use gaps (1, 3, 5...) allowing insertions without reordering
 *
 * 2. Drag Operation State
 *    - DragOperation: Tracks which item is being dragged
 *    - DragOverOperation: Manages hover state and calculates insertion points
 *    - New order values are computed based on drag-over target position
 *
 * 3. Reordering Process
 *    a. During Drag:
 *       - Track current drag item
 *       - Calculate potential insertion points
 *       - Determine before/after position relative to target
 *
 *    b. On Drop:
 *       - Apply new order value to dragged item
 *       - Sort itemOrders array by order values
 *       - Rebuild client's items array using sorted orders
 *       - UI updates automatically from reordered items
 *
 * 4. Key Functions
 *    - createInitialOrders(): Sets up initial order values
 *    - updateItemOrders(): Applies drag operation changes
 *    - reorderItems(): Rebuilds items array after sort
 *    - calculateMoveDragItem(): Handles keyboard navigation
 *
 * Example Flow:
 * consider items:
 * a, b, c
 * (items) → [0:a, 1:b, 2:c] (itemOrders) → [0:1, 1:3, 2:5] → drag c before a →
 * (new itemOrders) → [0:1, 1:3, 2:0] sort → [0:c, 1:a, 2:c] (final items)
 */

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
    newOrder:
      side === 'before'
        ? itemOrders[dragOverIndex].order - 1
        : itemOrders[dragOverIndex].order + 1
  };
}

/**
 * Determines if drag over operation should be updated
 */
export function canDragOver(
  newOperation: DragOverOperation,
  currentDragOp: DragOperation | null,
  currentDragOverOp: DragOverOperation | null
): boolean {
  return (
    newOperation.dragOverIndex !== (currentDragOp?.dragIndex ?? -100) &&
    newOperation.newOrder !== (currentDragOverOp?.newOrder ?? -100)
  );
}

/**
 * Updates item orders based on drop operation
 */
export function updateDraggedItemsSortValueInItemOrders(
  itemOrders: ItemOrder[],
  dragItemIndex: number,
  newOrder: number
): ItemOrder[] {
  const copy = JSON.parse(JSON.stringify(itemOrders)) as ItemOrder[];
  copy[dragItemIndex].order = newOrder;
  return copy.sort((a, b) => a.order - b.order);
}

/**
 * Reorders items based on item orders
 */
export function reorderItems<T>(items: T[], itemOrders: ItemOrder[]): T[] {
  return itemOrders.map((itemOrder) => items[itemOrder.index]);
}

/**
 * Calculates new position when moving item up/down
 */
export function keyboardMoveDragItem(
  direction: MoveDirectionType,
  currentIndex: number,
  itemOrders: ItemOrder[],
  maxIndex: number
): DragOverOperation | null {
  const dragOverIndex =
    direction === 'up'
      ? Math.max(0, currentIndex - 1)
      : Math.min(maxIndex, currentIndex + 1);

  if (dragOverIndex === currentIndex) {
    return null;
  }

  return {
    dragOverIndex,
    newOrder:
      direction === 'up'
        ? itemOrders[dragOverIndex].order - 1
        : itemOrders[dragOverIndex].order + 1
  };
}

/**
 * Checks if an item is currently being dragged
 */
export function isDraggingItem(
  listIndex: number,
  dragOp: DragOperation | null
): boolean {
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
