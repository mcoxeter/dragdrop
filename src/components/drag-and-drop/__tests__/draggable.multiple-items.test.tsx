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

describe('Draggable - multiple items interactions', () => {
  it('should not call onReorder when dropping on source position', () => {
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

    // Drag first item
    fireEvent.dragStart(firstItem);
    // Try to drop it back on itself
    fireEvent.dragOver(firstItem);
    fireEvent.drop(firstItem);

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('should call onReorder when dropping on a different position', () => {
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
    const secondItem = screen
      .getByText('Second item')
      .closest('[role="button"]')!;

    // Drag first item to second position
    fireEvent.dragStart(firstItem);
    fireEvent.dragOver(secondItem);
    fireEvent.drop(secondItem);

    expect(onReorder).toHaveBeenCalledWith({
      sourceIndex: 0,
      targetIndex: 1
    });
  });

  it('should handle dropping above/below target correctly', () => {
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
    const secondItem = screen
      .getByText('Second item')
      .closest('[role="button"]')!;
    const secondItemRect = secondItem.getBoundingClientRect();

    // Drag first item to above second item
    fireEvent.dragStart(firstItem);
    fireEvent.dragOver(secondItem, {
      clientY: secondItemRect.top + 1 // Drop near top
    });
    fireEvent.drop(secondItem);

    expect(onReorder).toHaveBeenCalledWith({
      sourceIndex: 0,
      targetIndex: 1
    });

    // Reset mock
    onReorder.mockClear();

    // Drag first item to below second item
    fireEvent.dragStart(firstItem);
    fireEvent.dragOver(secondItem, {
      clientY: secondItemRect.bottom - 1 // Drop near bottom
    });
    fireEvent.drop(secondItem);

    expect(onReorder).toHaveBeenCalledWith({
      sourceIndex: 0,
      targetIndex: 1
    });
  });
});
