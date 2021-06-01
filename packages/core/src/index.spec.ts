import { add } from '.';

describe('add function', () => {
  it('should add two numbers together', () => {
    const result = add(10, 5);
    expect(result).toBe(15);
  });
});
