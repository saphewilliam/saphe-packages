import { new_add } from '../src';

describe('new add function', () => {
  it('should add three numbers together', () => {
    const result = new_add(6, 9, 1);
    expect(result).toBe(16);
  });
});
