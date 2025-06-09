import { screen } from '@testing-library/react';
import { Draggable } from '../draggable';
import { defaultProps, renderWithProvider } from './setup';

describe('Draggable - rendering', () => {
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
});
