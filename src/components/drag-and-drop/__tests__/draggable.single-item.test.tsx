import { screen, fireEvent } from '@testing-library/react';
import { Draggable } from '../draggable';
import { renderWithProvider } from './setup';

const singleItemProps = {
  index: 0,
  maxIndex: 1,
  children: <div>Only item</div>
};

describe('Draggable - single item interactions', () => {
  it('should not call onReorder when dropping on itself', () => {
    const onReorder = jest.fn();
    renderWithProvider(<Draggable {...singleItemProps} />, onReorder);
    const element = screen.getByRole('button');

    fireEvent.dragStart(element);
    fireEvent.dragOver(element);
    fireEvent.drop(element);

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('maintains aria-grabbed state through drag operations', () => {
    renderWithProvider(<Draggable {...singleItemProps} />);
    const element = screen.getByRole('button');

    fireEvent.dragStart(element);
    expect(element).toHaveAttribute('aria-grabbed', 'true');

    fireEvent.dragEnd(element);
    expect(element).toHaveAttribute('aria-grabbed', 'false');
  });

  it('cancels drag operation with Escape', () => {
    const onReorder = jest.fn();
    renderWithProvider(<Draggable {...singleItemProps} />, onReorder);
    const element = screen.getByRole('button');

    fireEvent.keyDown(element, { key: ' ' });
    expect(element).toHaveAttribute('aria-grabbed', 'true');

    fireEvent.keyDown(element, { key: 'Escape' });
    expect(element).toHaveAttribute('aria-grabbed', 'false');
    expect(onReorder).not.toHaveBeenCalled();
  });
});
