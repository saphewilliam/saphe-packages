import { add } from '../src';

describe('add', () => {
  it('adds integers', () => {
    expect(add(10, 5)).toBe(15);
    expect(add(14, 9)).toBe(23);
  });
});
