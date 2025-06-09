import React from 'react';
import styles from './draggable.module.scss';
import { formatText } from '../../utils/i18n-utils';
import type { DraggableTexts } from './draggable';

type ScreenReaderAnnouncementsProps = {
  /** Index of the item */
  index: number;
  /** Total number of items */
  maxIndex: number;
  /** Whether the item is being dragged */
  isDragging: boolean;
  /** Whether an item is being dragged over */
  isOver: boolean;
  /** Text configuration */
  texts: Required<DraggableTexts>;
};

/**
 * Renders screen reader announcements for drag and drop operations
 */
export function ScreenReaderAnnouncements({
  index,
  maxIndex,
  isDragging,
  isOver,
  texts
}: ScreenReaderAnnouncementsProps) {
  // Helper for screen reader text
  const getStatusText = React.useCallback(() => {
    if (isDragging) return texts.itemBeingDragged;
    if (isOver) return texts.dropPositionAvailable;
    return texts.pressToStartDragging;
  }, [isDragging, isOver, texts]);

  // Helper for applying text templates
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
      {isDragging && (
        <div role='status' aria-live='polite' className={styles.visuallyHidden}>
          {applyTemplate(texts.draggingStatusTemplate)}
        </div>
      )}
    </>
  );
}
