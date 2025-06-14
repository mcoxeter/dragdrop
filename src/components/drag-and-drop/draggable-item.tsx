import React from 'react';
import styles from './draggable.module.scss';
import type { DraggableTexts } from './draggable';
import { useDragContext } from './drag-context';

type DraggableItemProps = {
  /** Index of the item */
  indexInList: number;
  /** Total number of items */
  // maxIndex: number;
  /** The content to make draggable */
  children: React.ReactNode;
  /** Whether dragging is disabled */
  disabled: boolean;

  /** a11y texts */
  texts: Required<DraggableTexts>;
  /** Drag start handler */
  onDragStart: () => void;
  /** Drag end handler */
  onDragEnd: () => void;
  /** Drag over handler */
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Drop handler */
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Key down handler */
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

/**
 * Core draggable item component that handles events and renders the draggable element
 */
export function DraggableItem({
  indexInList,
  children,
  disabled,
  texts,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onKeyDown
}: DraggableItemProps) {
  const context = useDragContext();
  // Class names for different states
  const classNames = React.useMemo(
    () =>
      [
        styles.draggable,
        context.isDragItem(indexInList) && styles.dragging,
        context.getDropInsertPosition(indexInList) === 'insert-before' &&
          styles['over-before'],
        context.getDropInsertPosition(indexInList) === 'insert-after' &&
          styles['over-after'],
        disabled && styles.disabled
      ]
        .filter(Boolean)
        .join(' '),
    [context, indexInList, disabled]
  );

  return (
    <div
      className={classNames}
      draggable={!disabled}
      data-index={indexInList}
      tabIndex={disabled ? -1 : 0}
      role='button'
      aria-label={context.isDragItem(indexInList) ? texts.itemBeingDragged : ''}
      aria-roledescription={texts.draggableItemDescription}
      aria-describedby={`drag-instructions`}
      aria-grabbed={context.isDragItem(indexInList)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
