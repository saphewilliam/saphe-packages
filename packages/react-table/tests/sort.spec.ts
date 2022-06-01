import { renderHook, act } from '@testing-library/react';
import useTable, { Data, Columns, State, SortOrder } from '../src';

export const hello = 'test';

interface SortTableColumns {
  stringCol: string;
  numberCol: number;
  boolCol: boolean;
  arrayCol: string[];
  optionalCol: number | null;
  complexCol: { key1: number; key2: string };
}

const columns: Columns<SortTableColumns> = {
  stringCol: {},
  numberCol: {},
  boolCol: {},
  arrayCol: { sort: (a, b) => a[0]?.localeCompare(b[0] ?? '') ?? 0 },
  complexCol: { stringify: ({ key2 }) => key2 },
  optionalCol: {},
};

const data: Data<SortTableColumns> = [
  {
    stringCol: 'English',
    numberCol: 10,
    boolCol: true,
    arrayCol: ['array', 'number', '1'],
    complexCol: { key1: 48, key2: 'key 2' },
  },
  {
    stringCol: 'Dutch',
    numberCol: 31,
    boolCol: false,
    arrayCol: ['lijst', 'nummer', '2'],
    complexCol: { key1: 1, key2: 'sleutel 2' },
  },
  {
    stringCol: 'Spanish',
    numberCol: 24,
    boolCol: false,
    arrayCol: ['lista', 'numero', '3'],
    complexCol: { key1: 58, key2: 'llave 2' },
  },
];

function expectDefaultSort<T>(
  result: { current: State<SortTableColumns> },
  colId: number,
  sequence: T[],
): void {
  const e = (order: SortOrder, index: number) => {
    expect(result.current.headers[colId]?.sortOrder).toBe(order);
    expect(JSON.stringify(result.current.rows[0]?.cells[colId]?.value)).toBe(
      JSON.stringify(sequence[index]),
    );
  };
  const a = () => {
    if (result.current.headers[colId]?.toggleSort)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      act(() => result.current.headers[colId]?.toggleSort!());
  };

  [SortOrder.UNSORTED, SortOrder.ASC, SortOrder.DESC].map((order, index) => {
    e(order, index);
    a();
  });
  e(SortOrder.UNSORTED, 0);
}

describe('Sort', () => {
  it('sorts rows by column', () => {
    const { result } = renderHook(() => useTable<SortTableColumns>(columns, data));
    expectDefaultSort(result, 0, ['English', 'Dutch', 'Spanish']);
    expectDefaultSort(result, 1, [10, 10, 31]);
    expectDefaultSort(result, 2, [true, false, true]);
    expectDefaultSort(result, 3, [
      ['array', 'number', '1'],
      ['array', 'number', '1'],
      ['lista', 'numero', '3'],
    ]);
    expectDefaultSort(result, 4, [
      { key1: 48, key2: 'key 2' },
      { key1: 48, key2: 'key 2' },
      { key1: 1, key2: 'sleutel 2' },
    ]);
    expectDefaultSort(result, 5, [undefined, undefined, undefined]);
  });

  it('sorts data initially', () => {
    const { result } = renderHook(() =>
      useTable<SortTableColumns>(columns, data, {
        sort: { initial: { column: 'stringCol', order: SortOrder.ASC } },
      }),
    );
    expect(result.current.rows[0]?.cells[0]?.stringValue).toBe('Dutch');
  });
});
