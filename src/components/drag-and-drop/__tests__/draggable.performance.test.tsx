import { screen, fireEvent } from '@testing-library/react';
import { Draggable } from '../draggable';
import { renderWithProvider } from './setup';
import React from 'react';

describe('Draggable - performance', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not re-render children unnecessarily', () => {
    const renderCounter = jest.fn();
    const TestChild = React.memo(() => {
      renderCounter();
      return <div>Test Child</div>;
    });

    const onReorder = jest.fn();
    renderWithProvider(
      <Draggable index={0} maxIndex={1}>
        <TestChild />
      </Draggable>,
      onReorder
    );

    const element = screen.getByRole('button');

    // Initial render
    expect(renderCounter).toHaveBeenCalledTimes(1);

    // Drag operations should not cause child re-renders
    fireEvent.dragStart(element);
    expect(renderCounter).toHaveBeenCalledTimes(1);

    fireEvent.dragEnd(element);
    expect(renderCounter).toHaveBeenCalledTimes(1);
  });

  it('should handle rapid drag operations', () => {
    const onReorder = jest.fn();
    renderWithProvider(
      <>
        <Draggable index={0} maxIndex={2}>
          Item 1
        </Draggable>
        <Draggable index={1} maxIndex={2}>
          Item 2
        </Draggable>
      </>,
      onReorder
    );

    const firstItem = screen.getByText('Item 1').closest('[role="button"]')!;
    const secondItem = screen.getByText('Item 2').closest('[role="button"]')!;

    // Rapid drag operations
    for (let i = 0; i < 10; i++) {
      fireEvent.dragStart(firstItem);
      fireEvent.dragEnter(secondItem);
      fireEvent.dragOver(secondItem);
      fireEvent.drop(secondItem);
    }

    // Should handle all operations without errors
    expect(onReorder).toHaveBeenCalledTimes(10);
  });

  it('should cleanup properly on unmount', () => {
    const onReorder = jest.fn();
    const { unmount } = renderWithProvider(
      <Draggable index={0} maxIndex={1}>
        Test Item
      </Draggable>,
      onReorder
    );

    const element = screen.getByRole('button');

    // Start drag
    fireEvent.dragStart(element);

    // Unmount during drag
    unmount();

    // Should not cause errors or memory leaks
    expect(() => {
      jest.runAllTimers();
    }).not.toThrow();
  });
});
