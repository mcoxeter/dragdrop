import React from 'react';
import styles from './draggable.module.scss';

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
  dragHandle
}: DraggableProps) {
  // Component state
  const [isDragging, setIsDragging] = React.useState(false);
  const [isOver, setIsOver] = React.useState(false);
  
  // Ref for the draggable element
  const elementRef = React.useRef<HTMLDivElement>(null);

  // Class names for different states
  const classNames = [
    styles.draggable,
    isDragging && styles.dragging,
    isOver && styles.over,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={elementRef}
      className={classNames}
      draggable={!disabled}
      data-testid={testId}
      data-index={index}
      aria-grabbed={isDragging}
      aria-dropeffect={isOver ? 'move' : undefined}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Draggable item ${index + 1} of ${maxIndex}`}
    >
      {dragHandle ? (
        <div className={styles.handleContainer}>
          <div className={styles.handle} aria-hidden="true">
            {dragHandle}
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
