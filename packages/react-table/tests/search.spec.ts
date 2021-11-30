import { renderHook, act, RenderResult } from '@testing-library/react-hooks';
import useTable, { Data, Columns, Options, SearchMode, State } from '../src';

interface SearchTableData {
  textCol: string;
  complexTextCol: { field1: number; field2: string };
  optionalTextCol: string | null;
  unsearchableCol: string;
}

const columns: Columns<SearchTableData> = {
  textCol: {},
  complexTextCol: { stringify: ({ field1 }) => String(field1) },
  optionalTextCol: { defaultValue: 'default' },
  unsearchableCol: { unsearchable: true },
};

const data: Data<SearchTableData> = [
  {
    textCol: 'simple text',
    complexTextCol: { field1: 10, field2: 'complex text' },
    unsearchableCol: 'unsearchable text',
  },
  {
    textCol: 'second row',
    complexTextCol: { field1: 120, field2: 'second complex text' },
    optionalTextCol: 'filled optional',
    unsearchableCol: 'this should not be searched',
  },
];

function expectRowSearch(
  result: RenderResult<State<SearchTableData>>,
  searchString: string,
  expectedLength: number,
): void {
  act(() => result.current.searchHelpers.setSearchString(searchString));
  expect(result.current.rows.length).toBe(expectedLength);
}

describe('Search', () => {
  it('provides exact searching', () => {
    const options: Options<SearchTableData> = { search: { mode: SearchMode.EXACT } };
    const { result } = renderHook(() => useTable<SearchTableData>(columns, data, options));
    expect(result.current.rows.length).toBe(2);

    expectRowSearch(result, 'text', 1);
    expectRowSearch(result, 'complex', 0);
    expectRowSearch(result, 'default', 1);
    expectRowSearch(result, 'should', 0);
    expectRowSearch(result, 'optional', 1);
    expectRowSearch(result, 'unsearchable', 0);
    expectRowSearch(result, '10', 1);
  });

  it('provides fuzzy searching', () => {
    const options: Options<SearchTableData> = { search: { mode: SearchMode.FUZZY } };
    const { result } = renderHook(() => useTable<SearchTableData>(columns, data, options));
    expect(result.current.rows.length).toBe(2);

    expectRowSearch(result, 'tet', 1);
    expectRowSearch(result, 'complex', 0);
    expectRowSearch(result, 'default', 1);
    expectRowSearch(result, 'should', 0);
    expectRowSearch(result, 'optional', 1);
    expectRowSearch(result, 'unsearchable', 0);
    expectRowSearch(result, '10', 2);
  });

  it('test', () => {
    const { result } = renderHook(() =>
      useTable<{ complex: { field1: string }; optional: string | null }>(
        { complex: {}, optional: {} },
        [{ complex: { field1: 'field1' } }],
      ),
    );
    console.warn = jest.fn();

    act(() => result.current.searchHelpers.setSearchString('search string'));
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
