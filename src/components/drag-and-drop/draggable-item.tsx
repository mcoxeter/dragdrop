import React from 'react';
import styles from './draggable.module.scss';
import type { DraggableTexts } from './draggable';
import { formatText } from '../../utils/i18n-utils';

type DraggableItemProps = {
  /** Index of the item */
  index: number;
  /** Total number of items */
  maxIndex: number;
  /** The content to make draggable */
  children: React.ReactNode;
  /** Whether dragging is disabled */
  disabled: boolean;
  /** Test ID for testing */
  'data-testid'?: string;
  /** Optional CSS class name */
  className?: string;
  /** Whether item is being dragged */
  isDragging: boolean;
  /** Whether item is being dragged over */
  isOver: boolean;
  /** The current drop position */
  dropPosition: 'before' | 'after' | null;
  /** Text configuration */
  texts: Required<DraggableTexts>;
  /** Reference to the draggable element */
  elementRef: React.RefObject<HTMLDivElement | null>;
  /** Drag start handler */
  onDragStart: () => void;
  /** Drag end handler */
  onDragEnd: () => void;
  /** Drag over handler */
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Drag leave handler */
  onDragLeave: () => void;
  /** Drop handler */
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Key down handler */
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

/**
 * Core draggable item component that handles events and renders the draggable element
 */
export function DraggableItem({
  index,
  maxIndex,
  children,
  disabled,
  'data-testid': testId,
  className,
  isDragging,
  isOver,
  dropPosition,
  texts,
  elementRef,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onKeyDown
}: DraggableItemProps) {
  // Class names for different states
  const classNames = React.useMemo(
    () =>
      [
        styles.draggable,
        isDragging && styles.dragging,
        isOver && styles.over,
        isOver && dropPosition === 'before' && styles['over-before'],
        isOver && dropPosition === 'after' && styles['over-after'],
        disabled && styles.disabled,
        className
      ]
        .filter(Boolean)
        .join(' '),
    [isDragging, isOver, dropPosition, disabled, className]
  );

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
    <div
      ref={elementRef}
      className={classNames}
      draggable={!disabled}
      data-testid={testId}
      data-index={index}
      tabIndex={disabled ? -1 : 0}
      role='button'
      aria-label={applyTemplate(texts.itemPositionTemplate)}
      aria-roledescription={texts.draggableItemDescription}
      aria-describedby={`drag-instructions-${index}`}
      aria-grabbed={isDragging}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
