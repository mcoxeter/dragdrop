import React from 'react';
import styles from './draggable.module.scss';
import { formatText } from '../../utils/i18n-utils';
import type { DraggableTexts } from './draggable';
import { useDragContext } from './drag-context';
import { defaultTexts } from './default-texts';

type ScreenReaderAnnouncementsProps = {
  /** Text configuration */
  texts?: DraggableTexts;
};

/**
 * Renders screen reader announcements for drag and drop operations
 */
export function ScreenReaderAnnouncements({
  texts
}: ScreenReaderAnnouncementsProps) {
  const context = useDragContext();

  const finalTexts = React.useMemo<Required<DraggableTexts>>(
    () => ({ ...defaultTexts, ...texts }),
    [texts]
  );

  // Helper for screen reader text
  const getStatusText = React.useCallback(() => {
    const dragOverInfo = context.getDragOverInfo();
    const dragOperation = context.getDragOperation();

    if (dragOperation && dragOverInfo) {
      return formatText(finalTexts.draggingStatusTemplate, {
        direction: dragOverInfo.side === 'insert-before' ? 'above' : 'below',
        dragOverIndex: dragOverInfo.dragOverIndex,
        draggedIndex: dragOperation.dragIndex
      });
    }

    return finalTexts.pressToStartDragging;
  }, [context, finalTexts]);

  return (
    <>
      <div
        id={`drag-instructions`}
        className={styles.visuallyHidden}
        aria-hidden='true'
      >
        {getStatusText()}
      </div>
    </>
  );
}
