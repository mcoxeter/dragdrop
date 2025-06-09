import { render, screen, fireEvent } from '@testing-library/react';
import { Draggable } from './draggable';
import { DragProvider } from '../drag-context';

describe('Draggable', () => {
  const defaultProps = {
    index: 0,
    maxIndex: 3,
    children: <div>Drag me</div>
  };

  const renderWithProvider = (ui: React.ReactNode, onReorder = jest.fn()) => {
    return render(<DragProvider onReorder={onReorder}>{ui}</DragProvider>);
  };

  describe('internationalization', () => {
    it('uses default texts when no custom texts provided', () => {
      renderWithProvider(<Draggable {...defaultProps} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Draggable item 1 of 3'
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-roledescription',
        'draggable item'
      );
    });

    it('uses custom texts when provided', () => {
      const customTexts = {
        itemPositionTemplate: 'Item {index} sur {total}',
        draggableItemDescription: 'élément déplaçable'
      };

      renderWithProvider(<Draggable {...defaultProps} texts={customTexts} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Item 1 sur 3'
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-roledescription',
        'élément déplaçable'
      );
    });

    it('merges custom texts with defaults', () => {
      const customTexts = {
        itemPositionTemplate: 'Item {index} sur {total}'
        // draggableItemDescription not provided, should use default
      };

      renderWithProvider(<Draggable {...defaultProps} texts={customTexts} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Item 1 sur 3'
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-roledescription',
        'draggable item'
      );
    });
  });

  it('renders children content', () => {
    renderWithProvider(<Draggable {...defaultProps} />);
    expect(screen.getByText('Drag me')).toBeInTheDocument();
  });

  it('applies correct base attributes', () => {
    renderWithProvider(<Draggable {...defaultProps} />);
    const element = screen.getByRole('button');

    expect(element).toHaveAttribute('draggable', 'true');
    expect(element).toHaveAttribute('data-index', '0');
    expect(element).toHaveAttribute('tabindex', '0');
    expect(element).toHaveAttribute('aria-label', 'Draggable item 1 of 3');
  });

  it('handles disabled state correctly', () => {
    renderWithProvider(<Draggable {...defaultProps} disabled />);
    const element = screen.getByRole('button');

    expect(element).toHaveAttribute('draggable', 'false');
    expect(element).toHaveAttribute('tabindex', '-1');
    expect(element).toHaveClass('disabled');
  });

  it('renders with custom className', () => {
    renderWithProvider(
      <Draggable {...defaultProps} className='custom-class' />
    );
    const element = screen.getByRole('button');

    expect(element).toHaveClass('custom-class');
  });

  it('renders drag handle when provided', () => {
    const handle = <span>≡</span>;
    renderWithProvider(<Draggable {...defaultProps} dragHandle={handle} />);

    expect(screen.getByText('≡')).toBeInTheDocument();
    expect(screen.getByText('≡').parentElement).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  describe('drag interactions', () => {
    it('sets aria-grabbed when dragging starts', () => {
      renderWithProvider(<Draggable {...defaultProps} />);
      const element = screen.getByRole('button');

      fireEvent.dragStart(element);
      expect(element).toHaveAttribute('aria-grabbed', 'true');

      fireEvent.dragEnd(element);
      expect(element).toHaveAttribute('aria-grabbed', 'false');
    });

    it('calls onReorder when dropping', () => {
      const onReorder = jest.fn();
      renderWithProvider(<Draggable {...defaultProps} />, onReorder);
      const element = screen.getByRole('button');

      fireEvent.dragStart(element);
      fireEvent.dragOver(element, {
        clientY: element.getBoundingClientRect().top + 5 // Drop near top
      });
      fireEvent.drop(element);

      expect(onReorder).toHaveBeenCalledWith({
        sourceIndex: 0,
        targetIndex: 0
      });
    });

    it('supports keyboard navigation', () => {
      const onReorder = jest.fn();
      renderWithProvider(<Draggable {...defaultProps} />, onReorder);
      const element = screen.getByRole('button');

      // Start dragging with Space
      fireEvent.keyDown(element, { key: ' ' });
      expect(element).toHaveAttribute('aria-grabbed', 'true');

      // Move with arrow keys
      fireEvent.keyDown(element, { key: 'ArrowDown' });

      // Drop with Enter
      fireEvent.keyDown(element, { key: 'Enter' });
      expect(element).toHaveAttribute('aria-grabbed', 'false');
    });

    it('cancels drag operation with Escape', () => {
      const onReorder = jest.fn();
      renderWithProvider(<Draggable {...defaultProps} />, onReorder);
      const element = screen.getByRole('button');

      fireEvent.keyDown(element, { key: ' ' });
      expect(element).toHaveAttribute('aria-grabbed', 'true');

      fireEvent.keyDown(element, { key: 'Escape' });
      expect(element).toHaveAttribute('aria-grabbed', 'false');
      expect(onReorder).not.toHaveBeenCalled();
    });
  });
});
