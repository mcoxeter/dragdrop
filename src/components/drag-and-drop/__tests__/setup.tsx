import { render } from '@testing-library/react';
import { DragProvider } from '../../drag-context';

export const defaultProps = {
  index: 0,
  maxIndex: 3,
  children: <div>Drag me</div>
};

export const renderWithProvider = (
  ui: React.ReactNode,
  onReorder = jest.fn()
) => {
  return render(<DragProvider onReorder={onReorder}>{ui}</DragProvider>);
};
