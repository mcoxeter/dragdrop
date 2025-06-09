import { screen, fireEvent } from '@testing-library/react';
import { Draggable } from '../draggable';
import { renderWithProvider } from './setup';
import { DragProvider } from '../drag-context';
import { render } from '@testing-library/react';

describe('Draggable - error handling', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw error when used outside DragProvider', () => {
    expect(() =>
      render(
        <Draggable index={0} maxIndex={1}>
          Test Item
        </Draggable>
      )
    ).toThrow('useDragContext must be used within a DragProvider');
  });

  it('should handle invalid index values', () => {
    const onReorder = jest.fn();
    renderWithProvider(
      <Draggable index={-1} maxIndex={1}>
        Invalid Index
      </Draggable>,
      onReorder
    );

    const element = screen.getByRole('button');

    // Try to drag item with invalid index
    fireEvent.dragStart(element);
    fireEvent.dragEnd(element);

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('should prevent reordering beyond boundaries', () => {
    const onReorder = jest.fn();
    renderWithProvider(
      <>
        <Draggable index={0} maxIndex={2}>
          First Item
        </Draggable>
        <Draggable index={1} maxIndex={2}>
          Last Item
        </Draggable>
      </>,
      onReorder
    );

    // Try to move first item before itself
    const firstItem = screen
      .getByText('First Item')
      .closest('[role="button"]')!;
    fireEvent.keyDown(firstItem, { key: ' ' }); // Start drag
    fireEvent.keyDown(firstItem, { key: 'ArrowUp' }); // Try to move up
    fireEvent.keyDown(firstItem, { key: 'Enter' }); // Drop

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('should handle missing onReorder callback', () => {
    // Render without onReorder callback
    render(
      <DragProvider>
        <Draggable index={0} maxIndex={1}>
          Test Item
        </Draggable>
      </DragProvider>
    );

    const element = screen.getByRole('button');

    // Should not throw when reordering without callback
    expect(() => {
      fireEvent.dragStart(element);
      fireEvent.dragEnd(element);
    }).not.toThrow();
  });
});
