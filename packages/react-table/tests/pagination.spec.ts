import { renderHook, act, RenderResult } from '@testing-library/react-hooks';
import useTable, { Columns, Data, Options, State } from '../src';

interface PaginationTableData {
  col: number;
}

const columns: Columns<PaginationTableData> = {
  col: {},
};

const data: Data<PaginationTableData> = Array.from(Array(50).keys()).map((i) => ({ col: i }));

const options: Options<PaginationTableData> = { pageSize: 10 };

function expectPagination(
  { current: { paginationHelpers } }: RenderResult<State<PaginationTableData>>,
  canPrev: boolean,
  canNext: boolean,
  page: number,
): void {
  expect(paginationHelpers.canPrev).toBe(canPrev);
  expect(paginationHelpers.canNext).toBe(canNext);
  expect(paginationHelpers.page).toBe(page);
}

describe('Pagination', () => {
  it('switches pages using utility functions', () => {
    const { result } = renderHook(() => useTable<PaginationTableData>(columns, data, options));
    expect(result.current.paginationHelpers.pageAmount).toBe(5);

    for (let i = 1; i < 6; i++) {
      expectPagination(result, i !== 1, i !== 5, i);
      if (i !== 5) act(() => result.current.paginationHelpers.nextPage());
    }
  });

  it('cannot set page outside of boundaries', () => {
    const { result } = renderHook(() => useTable<PaginationTableData>(columns, data, options));

    console.error = jest.fn();
    act(() => result.current.paginationHelpers.setPage(-1));
    expect(console.error).toHaveBeenCalledTimes(1);
    act(() => result.current.paginationHelpers.setPage(5));
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it('can be disabled', () => {
    const { result } = renderHook(() => useTable<PaginationTableData>(columns, data));

    console.warn = jest.fn();
    expect(result.current.paginationHelpers.pageAmount).toBe(1);
    expectPagination(result, false, false, 1);
    act(() => result.current.paginationHelpers.setPage(1));
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
