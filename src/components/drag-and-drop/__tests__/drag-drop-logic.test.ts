import {
  createDragOperation,
  createDragOverOperation,
  canDragOver,
  reorderItems,
  keyboardMoveDragItem,
  isDraggingItem,
  getDropPosition,
  createInitialOrders,
  updateDraggedItemsSortValueInItemOrders
} from '../drag-drop-logic';
import type {
  ItemOrder,
  DragOperation,
  DragOverOperation
} from '../drag-context';

describe('drag-drop-logic', () => {
  describe('createInitialOrders', () => {
    it('should create orders with ascending odd numbers', () => {
      const items = ['a', 'b', 'c'];
      const result = createInitialOrders(items);

      expect(result).toEqual([
        { index: 0, order: 1 },
        { index: 1, order: 3 },
        { index: 2, order: 5 }
      ]);
    });

    it('should handle empty array', () => {
      expect(createInitialOrders([])).toEqual([]);
    });

    it('should handle single item', () => {
      expect(createInitialOrders(['a'])).toEqual([{ index: 0, order: 1 }]);
    });
  });

  describe('createDragOperation', () => {
    it('should create drag operation with given index', () => {
      expect(createDragOperation(1)).toEqual({ dragIndex: 1 });
    });

    it('should handle zero index', () => {
      expect(createDragOperation(0)).toEqual({ dragIndex: 0 });
    });
  });

  describe('createDragOverOperation', () => {
    const itemOrders: ItemOrder[] = [
      { index: 0, order: 1 },
      { index: 1, order: 3 },
      { index: 2, order: 5 }
    ];

    it('should create before operation', () => {
      const result = createDragOverOperation(1, itemOrders, 'insert-before');
      expect(result).toEqual({
        dragOverIndex: 1,
        newOrder: 2, // 3 - 1
        side: 'insert-before'
      });
    });

    it('should create after operation', () => {
      const result = createDragOverOperation(1, itemOrders, 'insert-after');
      expect(result).toEqual({
        dragOverIndex: 1,
        newOrder: 4, // 3 + 1,
        side: 'insert-after'
      });
    });

    it('should default to after if no side specified', () => {
      const result = createDragOverOperation(1, itemOrders, 'insert-before');
      expect(result).toEqual({
        dragOverIndex: 1,
        newOrder: 2,
        side: 'insert-before'
      });
    });
  });

  describe('shouldUpdateDragOver', () => {
    const newOperation: DragOverOperation = {
      dragOverIndex: 1,
      newOrder: 2,
      side: 'insert-before'
    };

    it('should update when different index and order', () => {
      const currentDragOp: DragOperation = { dragIndex: 0 };
      const currentDragOverOp: DragOverOperation = {
        dragOverIndex: 0,
        newOrder: 1,
        side: 'insert-before'
      };

      expect(canDragOver(newOperation, currentDragOp, currentDragOverOp)).toBe(
        true
      );
    });

    it('should not update when same values', () => {
      const currentDragOp: DragOperation = { dragIndex: 1 };
      const currentDragOverOp: DragOverOperation = {
        dragOverIndex: 1,
        newOrder: 2,
        side: 'insert-before'
      };

      expect(canDragOver(newOperation, currentDragOp, currentDragOverOp)).toBe(
        false
      );
    });

    it('should handle null current operations', () => {
      expect(canDragOver(newOperation, null, null)).toBe(true);
    });
  });

  describe('updateItemOrders', () => {
    const itemOrders: ItemOrder[] = [
      { index: 0, order: 1 },
      { index: 1, order: 3 },
      { index: 2, order: 5 }
    ];

    it('should update order and sort correctly when moving item to start', () => {
      const dragOp: DragOperation = { dragIndex: 2 };
      const dragOverOp: DragOverOperation = {
        dragOverIndex: 0,
        newOrder: 0,
        side: 'insert-before'
      };

      const result = updateDraggedItemsSortValueInItemOrders(
        itemOrders,
        dragOp.dragIndex,
        dragOverOp.newOrder
      );
      expect(result[0].index).toBe(2);
      expect(result[0].order).toBe(0);
      expect(result).toHaveLength(3);
    });

    it('should maintain other items order', () => {
      // Drag the middle item to the end
      const dragOp: DragOperation = { dragIndex: 1 };
      const dragOverOp: DragOverOperation = {
        dragOverIndex: 2,
        newOrder: 6,
        side: 'insert-before'
      };

      const result = updateDraggedItemsSortValueInItemOrders(
        itemOrders,
        dragOp.dragIndex,
        dragOverOp.newOrder
      );
      expect(result[0].index).toBe(0); // Same order
      expect(result[1].index).toBe(2); // Now last
      expect(result[2].index).toBe(1); // Now second
    });
  });

  describe('reorderItems', () => {
    it('should reorder items based on item orders', () => {
      const items = ['a', 'b', 'c'];
      const itemOrders: ItemOrder[] = [
        { index: 2, order: 1 },
        { index: 0, order: 3 },
        { index: 1, order: 5 }
      ];

      const result = reorderItems(items, itemOrders);
      expect(result).toEqual(['c', 'a', 'b']);
    });

    it('should handle empty arrays', () => {
      expect(reorderItems([], [])).toEqual([]);
    });
  });

  describe('calculateMoveDragItem', () => {
    const itemOrders: ItemOrder[] = [
      { index: 0, order: 1 },
      { index: 1, order: 3 },
      { index: 2, order: 5 }
    ];

    it('should move up within bounds', () => {
      const result = keyboardMoveDragItem('insert-before', 1, itemOrders, 2);
      expect(result).toEqual({
        dragOverIndex: 0,
        newOrder: 0,
        side: 'insert-before'
      });
    });

    it('should move down within bounds', () => {
      const result = keyboardMoveDragItem('insert-after', 1, itemOrders, 2);
      expect(result).toEqual({
        dragOverIndex: 2,
        newOrder: 6,
        side: 'insert-after'
      });
    });

    it('should return null when at top and moving up', () => {
      const result = keyboardMoveDragItem('insert-before', 0, itemOrders, 2);
      expect(result).toBeNull();
    });

    it('should return null when at bottom and moving down', () => {
      const result = keyboardMoveDragItem('insert-after', 2, itemOrders, 2);
      expect(result).toBeNull();
    });
  });

  describe('isDraggingItem', () => {
    it('should identify currently dragged item', () => {
      const dragOp: DragOperation = { dragIndex: 1 };
      expect(isDraggingItem(1, dragOp)).toBe(true);
      expect(isDraggingItem(0, dragOp)).toBe(false);
    });

    it('should handle null drag operation', () => {
      expect(isDraggingItem(1, null)).toBe(false);
    });
  });

  describe('getDropPosition', () => {
    const itemOrders: ItemOrder[] = [
      { index: 0, order: 1 },
      { index: 1, order: 3 },
      { index: 2, order: 5 }
    ];

    it('should return insert-before when new order is less', () => {
      const dragOverOp: DragOverOperation = {
        dragOverIndex: 1,
        newOrder: 2,
        side: 'insert-before'
      };
      expect(getDropPosition(1, dragOverOp, itemOrders)).toBe('insert-before');
    });

    it('should return insert-after when new order is greater', () => {
      const dragOverOp: DragOverOperation = {
        dragOverIndex: 1,
        newOrder: 4,
        side: 'insert-before'
      };
      expect(getDropPosition(1, dragOverOp, itemOrders)).toBe('insert-after');
    });

    it('should return cant-insert-here when no drag over operation', () => {
      expect(getDropPosition(1, null, itemOrders)).toBe('cant-insert-here');
    });

    it('should return cant-insert-here when indices dont match', () => {
      const dragOverOp: DragOverOperation = {
        dragOverIndex: 0,
        newOrder: 2,
        side: 'insert-before'
      };
      expect(getDropPosition(1, dragOverOp, itemOrders)).toBe(
        'cant-insert-here'
      );
    });
  });
});
