import React from 'react';
import { useDragContext } from './drag-context';
import { DraggableItem } from './draggable-item';
import { ScreenReaderAnnouncements } from './screen-reader-announcements';

/**
 * Interface for customizable text strings used in the component
 */
export interface DraggableTexts {
  /** Message shown when item is being dragged */
  itemBeingDragged?: string;
  /** Message shown when drop position is available */
  dropPositionAvailable?: string;
  /** Instruction for starting drag operation */
  pressToStartDragging?: string;
  /** Template for item position label. Use {index} and {total} placeholders */
  itemPositionTemplate?: string;
  /** Template for dragging status. Use {index} and {total} placeholders */
  draggingStatusTemplate?: string;
  /** Description for draggable items */
  draggableItemDescription?: string;
}

// Default text strings
const defaultTexts: Required<DraggableTexts> = {
  itemBeingDragged: 'Item is being dragged',
  dropPositionAvailable: 'Drop position available',
  pressToStartDragging: 'Press space bar to start dragging',
  itemPositionTemplate: 'Draggable item {index} of {total}',
  draggingStatusTemplate:
    'Item being dragged, current position {index} of {total}',
  draggableItemDescription: 'draggable item'
};

/**
 * Props interface for the Draggable component
 */
export type DraggableProps = {
  /** Index of the item in the list */
  index: number;
  /** Total number of items in the list */
  maxIndex: number;
  /** Content to be made draggable */
  children: React.ReactNode;
  /** Optional class name for custom styling */
  className?: string;
  /** Whether drag functionality is disabled */
  disabled?: boolean;
  /** Test ID for testing purposes */
  'data-testid'?: string;
  /** Optional customization of component text strings */
  texts?: DraggableTexts;
};

/**
 * Draggable component enables drag and drop functionality for list items.
 * Must be used within a DragProvider context.
 */
export function Draggable({
  index,
  maxIndex,
  children,
  className,
  disabled = false,
  'data-testid': testId,
  texts = {}
}: DraggableProps) {
  // Component state
  const [isDragging, setIsDragging] = React.useState(false); // Context
  const context = useDragContext();

  // Derive isOver state from context
  const isOver = context.reorder?.targetIndex === index;

  // Memoized texts to prevent unnecessary re-renders
  const finalTexts = React.useMemo<Required<DraggableTexts>>(
    () => ({ ...defaultTexts, ...texts }),
    [texts]
  );
  // Drag state management helpers
  const startDragging = React.useCallback(() => {
    setIsDragging(true);
    context.setReorder({ sourceIndex: index, targetIndex: index });
  }, [context, index]);

  const endDragging = React.useCallback(() => {
    setIsDragging(false);
    context.setReorder(undefined);
  }, [context]);

  // Event handlers
  const handleDragStart = React.useCallback(() => {
    if (disabled) return;
    startDragging();
  }, [disabled, startDragging]);

  const handleDragEnd = React.useCallback(() => {
    endDragging();
  }, [endDragging]);

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const targetSide = e.clientY < midpoint ? 'before' : 'after';

      context.setReorder((prev) => ({
        sourceIndex: prev?.sourceIndex ?? index,
        targetIndex: index,
        targetSide
      }));
    },
    [context, disabled, index]
  ); // Reordering logic
  const commitReorder = React.useCallback(() => {
    const reorder = context.reorder;
    if (!reorder || reorder.sourceIndex === reorder.targetIndex) return;

    context.onReorder?.({
      sourceIndex: reorder.sourceIndex,
      targetIndex: reorder.targetIndex
    });
    endDragging();
  }, [context, endDragging]);

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      commitReorder();
    },
    [commitReorder]
  );

  // Navigation helpers
  const handleArrowNavigation = React.useCallback(
    (direction: 'up' | 'down') => {
      const sourceIndex = context.reorder?.sourceIndex ?? index;
      const currentPosition = context.reorder?.targetIndex ?? sourceIndex;

      const newIndex =
        direction === 'up'
          ? Math.max(0, currentPosition - 1)
          : Math.min(maxIndex - 1, currentPosition + 1);

      if (newIndex !== currentPosition) {
        context.setReorder((prev) => ({
          sourceIndex: prev?.sourceIndex ?? sourceIndex,
          targetIndex: newIndex,
          targetSide: direction === 'up' ? 'before' : 'after'
        }));
      }
    },
    [context, index, maxIndex]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (isDragging) {
            commitReorder();
          } else {
            startDragging();
          }
          break;

        case 'Escape':
          if (isDragging) {
            e.preventDefault();
            endDragging();
          }
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          if (isDragging) {
            e.preventDefault();
            handleArrowNavigation(e.key === 'ArrowUp' ? 'up' : 'down');
          }
          break;
      }
    },
    [
      disabled,
      isDragging,
      endDragging,
      startDragging,
      commitReorder,
      handleArrowNavigation
    ]
  );

  return (
    <>
      <ScreenReaderAnnouncements
        index={index}
        maxIndex={maxIndex}
        isDragging={isDragging}
        isOver={isOver}
        texts={finalTexts}
      />
      <DraggableItem
        index={index}
        maxIndex={maxIndex}
        disabled={disabled}
        data-testid={testId}
        className={className}
        isDragging={isDragging}
        isOver={isOver}
        dropPosition={context.reorder?.targetSide ?? null}
        texts={finalTexts}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
      >
        {children}
      </DraggableItem>
    </>
  );
}
