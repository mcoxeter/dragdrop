import React from 'react';
import styles from './draggable.module.scss';

type DragHandleProps = {
  /** The drag handle content */
  children: React.ReactNode;
};

/**
 * Renders a drag handle with proper styling and accessibility attributes
 */
export function DragHandle({ children }: DragHandleProps) {
  return (
    <div className={styles.handleContainer}>
      <div className={styles.handle} aria-hidden='true'>
        {children}
      </div>
    </div>
  );
}
