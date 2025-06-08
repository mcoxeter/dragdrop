import React from 'react';
import { useDragContext } from './drag-context';
import styles from './draggable.module.scss';

export type DragableProps = {
  index: number;
  maxIndex: number;
  children: React.ReactNode;
};

const componmentName = 'Dragable';
export const Dragable = ({ children, index }: DragableProps) => {
  const context = useDragContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      e.dataTransfer.dropEffect = 'move';
      const rect = e.currentTarget.getBoundingClientRect();

      const midpoint = rect.top + rect.height / 2;
      const isTopHalf = e.clientY < midpoint;

      context.setReorder((prev) => {
        return {
          sourceIndex: prev?.sourceIndex ?? index,
          targetIndex: prev?.targetIndex ?? index,
          targetSide: isTopHalf ? 'before' : 'after'
        };
      });
    },
    [index, context]
  );

  const reordering = context.reorder ? styles.reordering : '';
  return (
    <div
      ref={ref}
      className={`${styles.component} ${reordering}`}
      data-component={componmentName}
      draggable
      tabIndex={0}
      onDragStart={() => {
        context.setReorder((prev) => {
          return {
            sourceIndex: index,
            targetIndex: prev?.targetIndex ?? index
          };
        });
      }}
      onDragEnter={(e) => {
        console.log('enter' + e.currentTarget.getBoundingClientRect().height);
        context.setReorder((prev) => {
          return {
            sourceIndex: prev?.sourceIndex ?? index,
            targetIndex: index
          };
        });
      }}
      onDragOver={handleDragOver}
      onDrop={(e) => {
        e.preventDefault();
        setTimeout(() => {
          context.setReorder(undefined);
        }, 100);
        if (context.onReorder) {
          context.onReorder({
            sourceIndex: context.reorder?.sourceIndex ?? index,
            targetIndex: index
          });
        }
      }}
      onKeyUp={() =>
        // Enter or Space starts the drag
        // Enter or Space ends the drag
        // Escape cancels the drag
        // Arrow keys move the drag
        {}
      }
      style={{
        cursor: 'grab',
        position: 'relative'
      }}
    >
      <InsertLine index={index} moveTargetSide={'before'} />
      {children}
      <InsertLine index={index} moveTargetSide={'after'} />
      {context.reorder && context.reorder?.sourceIndex === index && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // semi-transparent dark overlay
            pointerEvents: 'none' // allows clicks to pass through if needed
          }}
        />
      )}
    </div>
  );
};

function InsertLine({
  index,
  moveTargetSide
}: {
  index: number;
  moveTargetSide: 'before' | 'after';
}) {
  const context = useDragContext();
  if (context.reorder?.sourceIndex === context.reorder?.targetIndex) {
    return (
      <div
        className={styles.invisible}
        data-index={index}
        data-info={moveTargetSide}
      />
    );
  }

  if (
    context.reorder?.targetIndex === index &&
    context.reorder.targetSide === moveTargetSide
  ) {
    return (
      <div
        className={styles['outlined-line']}
        data-index={index}
        data-info={moveTargetSide}
      />
    );
  } else {
    return (
      <div
        className={styles.invisible}
        data-index={index}
        data-info={moveTargetSide}
      />
    );
  }
}
