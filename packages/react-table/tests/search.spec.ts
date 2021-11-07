import { renderHook, act } from '@testing-library/react-hooks';
import useTable, { Data, Columns, Options, SearchMode } from '../src';

interface TableData {
  textCol: string;
  complexTextCol: { field1: number; field2: string };
  optionalTextCol: string | null;
  unsearchableCol: string;
}

const columns: Columns<TableData> = {
  textCol: {},
  complexTextCol: { stringify: ({ field1 }) => String(field1) },
  optionalTextCol: { defaultValue: 'default' },
  unsearchableCol: { unsearchable: true },
};

const data: Data<TableData> = [];

const options: Options<TableData> = { search: { mode: SearchMode.EXACT } };

describe('Search', () => {
  it('hello world', () => {
    const { result } = renderHook(() => useTable<TableData>(columns, data, options));

    // Why does this result in "code that causes React state updates should be wrapped into act(...) warning?"
    act(() => result.current.searchHelpers.setSearchString('hello world'));
    expect(1).toBe(1);
  });
});
