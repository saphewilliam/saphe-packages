import { add } from '@saphe/core';

export const new_add = (a: number, b: number, c: number): number => {
  return add(add(a, b), c);
};
