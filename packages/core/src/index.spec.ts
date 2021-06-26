import { add } from '.';

describe('add function', () => {
  it('should add two numbers together', () => {
    expect(add(10, 5)).toBe(15);
    expect(add(14, 9)).toBe(23);
  });
});
