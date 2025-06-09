import React from 'react';
import styles from './draggable.module.scss';
import { formatText } from '../../utils/i18n-utils';
import { useDragContext } from '../drag-context';
import type { Reorder } from '../drag-context';

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
  /** Optional drag handle component */
  dragHandle?: React.ReactNode;
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
  dragHandle,
  texts = {}
}: DraggableProps) {
  // Component state
  const [isDragging, setIsDragging] = React.useState(false);
  const [isOver, setIsOver] = React.useState(false);

  // Context and refs
  const context = useDragContext();
  const elementRef = React.useRef<HTMLDivElement>(null);

  // Memoized texts to prevent unnecessary re-renders
  const finalTexts = React.useMemo<Required<DraggableTexts>>(
    () => ({ ...defaultTexts, ...texts }),
    [texts]
  );

  // Mouse event handlers
  const handleDragStart = React.useCallback(() => {
    if (disabled) return;
    setIsDragging(true);
    context.setReorder({ sourceIndex: index, targetIndex: index });
  }, [context, disabled, index]);

  const handleDragEnd = React.useCallback(() => {
    setIsDragging(false);
    context.setReorder(undefined);
  }, [context]);

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
      setIsOver(true);
    },
    [context, disabled, index]
  );

  const handleDragLeave = React.useCallback(() => {
    setIsOver(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsOver(false);
      setIsDragging(false);

      const reorder = context.reorder;
      if (!reorder || reorder.sourceIndex === reorder.targetIndex) return;

      if (context.onReorder) {
        context.onReorder({
          sourceIndex: reorder.sourceIndex,
          targetIndex: index
        });
      }
      context.setReorder(undefined);
    },
    [context, index]
  );

  // Keyboard event handlers
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          if (isDragging) {
            e.preventDefault();
            handleDrop(e as unknown as React.DragEvent<HTMLDivElement>);
          } else {
            e.preventDefault();
            handleDragStart();
          }
          break;

        case 'Escape':
          if (isDragging) {
            e.preventDefault();
            handleDragEnd();
          }
          break;

        case 'ArrowUp':
        case 'ArrowDown':
          if (isDragging) {
            e.preventDefault();
            const newIndex =
              e.key === 'ArrowUp'
                ? Math.max(0, index - 1)
                : Math.min(maxIndex - 1, index + 1);

            context.setReorder((prev) => ({
              sourceIndex: prev?.sourceIndex ?? index,
              targetIndex: newIndex,
              targetSide: e.key === 'ArrowUp' ? 'before' : 'after'
            }));
          }
          break;
      }
    },
    [
      context,
      disabled,
      handleDragEnd,
      handleDragStart,
      handleDrop,
      index,
      isDragging,
      maxIndex
    ]
  );

  // Class names for different states
  const classNames = React.useMemo(
    () =>
      [
        styles.draggable,
        isDragging && styles.dragging,
        isOver && styles.over,
        disabled && styles.disabled,
        className
      ]
        .filter(Boolean)
        .join(' '),
    [isDragging, isOver, disabled, className]
  );

  // Helper for screen reader text
  const getStatusText = React.useCallback(() => {
    if (isDragging) return finalTexts.itemBeingDragged;
    if (isOver) return finalTexts.dropPositionAvailable;
    return finalTexts.pressToStartDragging;
  }, [isDragging, isOver, finalTexts]);

  // Apply template helper
  const applyTemplate = React.useCallback(
    (template: string) => {
      return formatText(template, {
        index: index + 1,
        total: maxIndex
      });
    },
    [index, maxIndex]
  );

  return (
    <>
      <div
        id={`drag-instructions-${index}`}
        className={styles.visuallyHidden}
        aria-hidden='true'
      >
        {getStatusText()}
      </div>
      <div
        ref={elementRef}
        className={classNames}
        draggable={!disabled}
        data-testid={testId}
        data-index={index}
        tabIndex={disabled ? -1 : 0}
        role='button'
        aria-label={applyTemplate(finalTexts.itemPositionTemplate)}
        aria-roledescription={finalTexts.draggableItemDescription}
        aria-describedby={`drag-instructions-${index}`}
        aria-grabbed={isDragging}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
      >
        {dragHandle ? (
          <div className={styles.handleContainer}>
            <div className={styles.handle} aria-hidden='true'>
              {dragHandle}
            </div>
            <div className={styles.content}>{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
      {isDragging && (
        <div role='status' aria-live='polite' className={styles.visuallyHidden}>
          {applyTemplate(finalTexts.draggingStatusTemplate)}
        </div>
      )}
    </>
  );
}
