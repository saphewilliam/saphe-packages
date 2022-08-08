import { useUrlParams, UseUrlParamsTypes } from '../src';
import { renderHook } from '@testing-library/react';
import { expectTypeOf } from 'expect-type';

describe('useUrlParams', () => {
  const warn = console.warn;
  beforeEach(() => (console.warn = jest.fn()));
  afterEach(() => (console.warn = warn));

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

  it('returns a correct object with a single param config', () => {
    let query: UseUrlParamsTypes.Query = { singleStringParam: 'Hello world' };
    const { result, rerender } = renderHook(() => useUrlParams('singleStringParam', query));
    expect(result.current.singleStringParam).toBe('Hello world');
    query = {};
    rerender();
    expect(result.current.singleStringParam).toBeNull();
  });

  it('returns a correct object with a multiple, mixed param config', () => {
    let query: UseUrlParamsTypes.Query = {
      mixed: 'Mixed',
      default: 'Default',
      defaultArr: ['Default1', 'Default2'],
      defaultNo: 'DefaultNo',
      string: 'String',
      stringArr: ['String1', 'String2'],
      stringNo: 'StringNo',
      number: '42',
      numberArr: ['1', '2', '3'],
      numberNo: '0',
      bool: 'true',
      boolArr: ['false'],
      boolNo: 'false',
    };
    const { result, rerender } = renderHook(() =>
      useUrlParams(
        [
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
        ],
        query,
      ),
    );

    expect(result.current.mixed).toBe('Mixed');
    expect(result.current.default).toBe('Default');
    expect(result.current.defaultArr.length).toBe(2);
    expect(result.current.defaultNo).toBe('DefaultNo');
    expect(result.current.string).toBe('String');
    expect(result.current.stringArr.length).toBe(2);
    expect(result.current.stringNo).toBe('StringNo');
    expect(result.current.number).toBe(42);
    expect(result.current.numberArr.length).toBe(3);
    expect(result.current.numberNo).toBe(0);
    expect(result.current.bool).toBe(true);
    expect(result.current.boolArr.length).toBe(1);
    expect(result.current.boolNo).toBe(false);

    query = {};
    rerender();

    expect(result.current.mixed).toBeNull();
    expect(result.current.default).toBeNull();
    expect(result.current.defaultArr.length).toBe(0);
    expect(result.current.defaultNo).toBeNull();
    expect(result.current.string).toBeNull();
    expect(result.current.stringArr.length).toBe(0);
    expect(result.current.stringNo).toBeNull();
    expect(result.current.number).toBeNull();
    expect(result.current.numberArr.length).toBe(0);
    expect(result.current.numberNo).toBeNull();
    expect(result.current.bool).toBeNull();
    expect(result.current.boolArr.length).toBe(0);
    expect(result.current.boolNo).toBeNull();

    expect(console.warn).toBeCalledTimes(0);
  });

  it('throws one `console.warning` per incorrect type input', () => {
    let query: UseUrlParamsTypes.Query = { number: 'hello' };
    const { result, rerender } = renderHook(() =>
      useUrlParams(
        [
          { name: 'number', type: 'number' },
          { name: 'numberArr', type: 'number', array: true },
          { name: 'bool', type: 'boolean' },
          { name: 'boolArr', type: 'boolean', array: true },
        ],
        query,
      ),
    );
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result.current.number).toBeNull();

    query = { numberArr: ['1', 'test', '3'] };
    rerender();
    expect(console.warn).toHaveBeenCalledTimes(2);
    expect(result.current.numberArr.length).toBe(2);

    query = { bool: 'True' };
    rerender();
    expect(console.warn).toHaveBeenCalledTimes(3);
    expect(result.current.bool).toBeNull();

    query = { boolArr: ['true', 'False'] };
    rerender();
    expect(console.warn).toHaveBeenCalledTimes(4);
    expect(result.current.boolArr.length).toBe(1);
  });

  it('parses a bool with different truthy and falsy values', () => {
    const { result } = renderHook(() =>
      useUrlParams(
        [{ name: 'boolArr', type: 'boolean', array: true }],
        { boolArr: ['true', 'false', 'True', 'False', 'on', 'off'] },
        { truthyStrings: ['true', 'on'], falsyStrings: ['false', 'off'] },
      ),
    );

    expect(result.current.boolArr.length).toBe(4);
    expect(console.warn).toBeCalledTimes(2);
  });

  it('returns the last item of an array if config states `array: false`', () => {
    const { result } = renderHook(() =>
      useUrlParams([{ name: 'noArr', array: false }], { noArr: ['first', 'middle', 'last'] }),
    );
    expect(result.current.noArr).toBe('last');
  });

  it('returns an item as array if if config states `array: true', () => {
    const { result } = renderHook(() =>
      useUrlParams([{ name: 'arr', array: true }], { arr: 'oneItem' }),
    );
    expect(result.current.arr.length).toBe(1);
    expect(result.current.arr[0]).toBe('oneItem');
  });
});
