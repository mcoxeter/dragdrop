import { formatText } from './i18n-utils';

describe('formatText', () => {
  it('replaces single placeholder', () => {
    expect(formatText('Hello {name}!', { name: 'World' })).toBe('Hello World!');
  });

  it('replaces multiple placeholders', () => {
    expect(formatText('Item {index} of {total}', { index: 1, total: 5 })).toBe(
      'Item 1 of 5'
    );
  });

  it('handles numbers', () => {
    expect(formatText('Count: {value}', { value: 42 })).toBe('Count: 42');
  });

  it('leaves template unchanged when no values provided', () => {
    expect(formatText('Hello {name}!', {})).toBe('Hello {name}!');
  });

  it('leaves unmatched placeholders unchanged', () => {
    expect(formatText('Hello {name}, count: {count}', { name: 'World' })).toBe(
      'Hello World, count: {count}'
    );
  });
});
