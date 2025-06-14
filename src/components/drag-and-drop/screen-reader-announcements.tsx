import React from 'react';
import styles from './draggable.module.scss';
import { formatText } from '../../utils/i18n-utils';
import type { DraggableTexts } from './draggable';
import { useDragContext } from './drag-context';

type ScreenReaderAnnouncementsProps = {
  /** Index of the item */
  indexInList: number;
  /** Total number of items */
  // maxIndex: number;
  /** Whether the item is being dragged */
  // isDragging: boolean;
  /** Whether an item is being dragged over */
  // isOver: boolean;
  /** Text configuration */
  texts: Required<DraggableTexts>;
};

/**
 * Renders screen reader announcements for drag and drop operations
 */
export function ScreenReaderAnnouncements({
  indexInList,
  texts
}: ScreenReaderAnnouncementsProps) {
  const context = useDragContext();
  // Helper for screen reader text
  const getStatusText = React.useCallback(() => {
    // if (isDragging) return texts.itemBeingDragged;
    if (context.isDragItem(indexInList)) return texts.itemBeingDragged;
    // if (isOver) return texts.dropPositionAvailable;
    if (context.getDropInsertPosition(indexInList) !== 'cant-insert-here') {
      return texts.dropPositionAvailable;
    }
    return texts.pressToStartDragging;
  }, [context, indexInList, texts]);

  // Helper for applying text templates
  const applyTemplate = React.useCallback(
    (template: string) => {
      return formatText(template, {
        index: indexInList + 1,
        total: context.getNumberOfItems()
      });
    },
    [indexInList, context]
  );

  return (
    <>
      <div
        id={`drag-instructions-${indexInList}`}
        className={styles.visuallyHidden}
        aria-hidden='true'
      >
        {getStatusText()}
      </div>
      {context.isDragItem(indexInList) && (
        <div role='status' aria-live='polite' className={styles.visuallyHidden}>
          {applyTemplate(texts.draggingStatusTemplate)}
        </div>
      )}
    </>
  );
}
