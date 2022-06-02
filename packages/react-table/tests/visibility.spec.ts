import { renderHook, act } from '@testing-library/react';
import useTable, { Data, Columns, State } from '../src';

interface VisibilityTableData {
  stringCol: string;
  numberCol: number;
  boolCol: boolean;
  arrayCol: string[];
  optionalCol: number | null; // TODO defaultvalues.spec.tsx
  complexCol: { key1: number; key2: string };
}

const columns: Columns<VisibilityTableData> = {
  stringCol: { hidden: true },
  numberCol: {},
  boolCol: {},
  arrayCol: { unhideable: true },
  optionalCol: {},
  complexCol: {},
};

const data: Data<VisibilityTableData> = [
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
    optionalCol: 300,
    complexCol: { key1: 1, key2: 'sleutel 2' },
  },
];

function expectColumns(
  {
    current: { headers, rows },
  }: {
    current: State<VisibilityTableData>;
  },
  firstColVals: [string, string, string] = ['numberCol', '10', '31'],
  nCols = Object.keys(columns).length - 1,
): void {
  expect(headers.length).toBe(nCols);
  expect(headers[0]?.name).toBe(firstColVals[0]);
  expect(rows[0]?.cells.length).toBe(nCols);
  expect(rows[0]?.cells[0]?.stringValue).toBe(firstColVals[1]);
  expect(rows[1]?.cells.length).toBe(nCols);
  expect(rows[1]?.cells[0]?.stringValue).toBe(firstColVals[2]);
}

describe('Visibility', () => {
  it('hides / shows all visibility-toggleable columns', () => {
    const { result } = renderHook(() => useTable<VisibilityTableData>(columns, data));
    expectColumns(result);

    act(() => result.current.visibilityHelpers.hideAll());
    expectColumns(result, ['arrayCol', 'array,number,1', 'lijst,nummer,2'], 1);

    act(() => result.current.visibilityHelpers.showAll());
    expectColumns(result);
  });

  it('toggles visibility for a single column', () => {
    const { result } = renderHook(() => useTable<VisibilityTableData>(columns, data));
    expectColumns(result);

    act(() => {
      if (result.current.headers[0]?.toggleVisibility) result.current.headers[0].toggleVisibility();
    });
    expectColumns(result, ['boolCol', 'true', 'false'], Object.keys(columns).length - 2);

    act(() => {
      if (result.current.originalHeaders[0]?.toggleVisibility)
        result.current.originalHeaders[0].toggleVisibility();
    });
    expectColumns(result);

    act(() => {
      if (result.current.originalHeaders[2]?.toggleVisibility)
        result.current.originalHeaders[2].toggleVisibility();
    });
    expectColumns(result);
  });

  it.todo('cannot hide an unhideable column');
});
