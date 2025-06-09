import { screen } from '@testing-library/react';
import { Draggable } from '../draggable';
import { defaultProps, renderWithProvider } from './setup';

describe('Draggable - internationalization', () => {
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
