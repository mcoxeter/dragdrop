import { screen, fireEvent } from '@testing-library/react';
import { Draggable } from '../draggable';
import { renderWithProvider } from './setup';

const firstItemProps = {
  index: 0,
  maxIndex: 3,
  children: <div>First item</div>
};

const secondItemProps = {
  index: 1,
  maxIndex: 3,
  children: <div>Second item</div>
};

describe('Draggable - keyboard navigation', () => {
  it('supports keyboard navigation between items', () => {
    const onReorder = jest.fn();
    renderWithProvider(
      <>
        <Draggable {...firstItemProps} />
        <Draggable {...secondItemProps} />
      </>,
      onReorder
    );

    const firstItem = screen
      .getByText('First item')
      .closest('[role="button"]')!;

    // Start dragging with Space
    fireEvent.keyDown(firstItem, { key: ' ' });
    expect(firstItem).toHaveAttribute('aria-grabbed', 'true');

    // Move down
    fireEvent.keyDown(firstItem, { key: 'ArrowDown' });
    // Drop with Enter
    fireEvent.keyDown(firstItem, { key: 'Enter' });

    expect(onReorder).toHaveBeenCalledWith({
      sourceIndex: 0,
      targetIndex: 1
    });
    expect(firstItem).toHaveAttribute('aria-grabbed', 'false');
  });

  it('moves item up with arrow key', () => {
    const onReorder = jest.fn();
    renderWithProvider(
      <>
        <Draggable {...firstItemProps} />
        <Draggable {...secondItemProps} />
      </>,
      onReorder
    );

    const secondItem = screen
      .getByText('Second item')
      .closest('[role="button"]')!;

    // Start dragging with Space
    fireEvent.keyDown(secondItem, { key: ' ' });
    expect(secondItem).toHaveAttribute('aria-grabbed', 'true');

    // Move up
    fireEvent.keyDown(secondItem, { key: 'ArrowUp' });
    // Drop with Enter
    fireEvent.keyDown(secondItem, { key: 'Enter' });

    expect(onReorder).toHaveBeenCalledWith({
      sourceIndex: 1,
      targetIndex: 0
    });
  });

  it('does not move beyond boundaries', () => {
    const onReorder = jest.fn();
    renderWithProvider(
      <>
        <Draggable {...firstItemProps} />
        <Draggable {...secondItemProps} />
      </>,
      onReorder
    );

    const firstItem = screen
      .getByText('First item')
      .closest('[role="button"]')!;

    // Start dragging
    fireEvent.keyDown(firstItem, { key: ' ' });

    // Try to move up beyond first position
    fireEvent.keyDown(firstItem, { key: 'ArrowUp' });
    // Drop
    fireEvent.keyDown(firstItem, { key: 'Enter' });

    // Should not have called onReorder as we can't move up from first position
    expect(onReorder).not.toHaveBeenCalled();
  });
});
