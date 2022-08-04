import { useUrlParams } from '../src';
import { act, renderHook } from '@testing-library/react';
import { expectTypeOf } from 'expect-type';

describe('useUrlParams', () => {
  it('generates a type-safe object with query parameters', () => {
    const { result: resultSingle } = renderHook(() => useUrlParams('singleStringParam'));
    const { result: resultArray } = renderHook(() => useUrlParams(['Only', 'strings']));
    const { result: resultMixed } = renderHook(() =>
      useUrlParams([
        'mixed',
        { name: 'default' },
        { name: 'defaultArr', array: true },
        { name: 'defaultNo', array: false },
        { name: 'string', type: 'string' },
        { name: 'stringArr', type: 'string', array: true },
        { name: 'stringNo', type: 'string', array: false },
        { name: 'number', type: 'number' },
        { name: 'numberArr', type: 'number', array: true },
        { name: 'numberNo', type: 'number', array: false },
        { name: 'bool', type: 'boolean' },
        { name: 'boolArr', type: 'boolean', array: true },
        { name: 'boolNo', type: 'boolean', array: false },
      ]),
    );

    expectTypeOf(resultSingle.current).not.toBeAny();
    expectTypeOf(resultSingle.current).not.toHaveProperty('random');
    expectTypeOf(resultSingle.current)
      .toHaveProperty('singleStringParam')
      .toEqualTypeOf<string | null>();

    expectTypeOf(resultArray.current).not.toBeAny();
    expectTypeOf(resultArray.current).not.toHaveProperty('random');
    expectTypeOf(resultArray.current).toHaveProperty('Only').toEqualTypeOf<string | null>();
    expectTypeOf(resultArray.current).toHaveProperty('strings').toEqualTypeOf<string | null>();

    expectTypeOf(resultMixed.current).not.toBeAny();
    expectTypeOf(resultMixed.current).not.toHaveProperty('random');
    expectTypeOf(resultMixed.current).toHaveProperty('mixed').toEqualTypeOf<string | null>();
    expectTypeOf(resultMixed.current).toHaveProperty('default').toEqualTypeOf<string | null>();
    expectTypeOf(resultMixed.current).toHaveProperty('defaultArr').toEqualTypeOf<string[]>();
    expectTypeOf(resultMixed.current).toHaveProperty('defaultNo').toEqualTypeOf<string | null>();
    expectTypeOf(resultMixed.current).toHaveProperty('string').toEqualTypeOf<string | null>();
    expectTypeOf(resultMixed.current).toHaveProperty('stringArr').toEqualTypeOf<string[]>();
    expectTypeOf(resultMixed.current).toHaveProperty('stringNo').toEqualTypeOf<string | null>();
    expectTypeOf(resultMixed.current).toHaveProperty('number').toEqualTypeOf<number | null>();
    expectTypeOf(resultMixed.current).toHaveProperty('numberArr').toEqualTypeOf<number[]>();
    expectTypeOf(resultMixed.current).toHaveProperty('numberNo').toEqualTypeOf<number | null>();
    expectTypeOf(resultMixed.current).toHaveProperty('bool').toEqualTypeOf<boolean | null>();
    expectTypeOf(resultMixed.current).toHaveProperty('boolArr').toEqualTypeOf<boolean[]>();
    expectTypeOf(resultMixed.current).toHaveProperty('boolNo').toEqualTypeOf<boolean | null>();
  });
});
