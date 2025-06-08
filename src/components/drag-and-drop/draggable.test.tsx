import { render, screen } from '@testing-library/react';
import { Draggable } from './draggable';

describe('Draggable', () => {
  const defaultProps = {
    index: 0,
    maxIndex: 3,
    children: <div>Drag me</div>
  };

  it('renders children content', () => {
    render(<Draggable {...defaultProps} />);
    expect(screen.getByText('Drag me')).toBeInTheDocument();
  });

  it('applies correct base attributes', () => {
    render(<Draggable {...defaultProps} />);
    const element = screen.getByRole('button');

    expect(element).toHaveAttribute('draggable', 'true');
    expect(element).toHaveAttribute('data-index', '0');
    expect(element).toHaveAttribute('tabindex', '0');
    expect(element).toHaveAttribute('aria-label', 'Draggable item 1 of 3');
  });

  it('handles disabled state correctly', () => {
    render(<Draggable {...defaultProps} disabled />);
    const element = screen.getByRole('button');

    expect(element).toHaveAttribute('draggable', 'false');
    expect(element).toHaveAttribute('tabindex', '-1');
    expect(element).toHaveClass('disabled');
  });

  it('renders with custom className', () => {
    render(<Draggable {...defaultProps} className='custom-class' />);
    const element = screen.getByRole('button');

    expect(element).toHaveClass('custom-class');
  });

  it('renders drag handle when provided', () => {
    const handle = <span>≡</span>;
    render(<Draggable {...defaultProps} dragHandle={handle} />);

    expect(screen.getByText('≡')).toBeInTheDocument();
    expect(screen.getByText('≡').parentElement).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
