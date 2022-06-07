import { useEffect, useMemo } from 'react';
import { Columns, ColumnTypes, Data, Options, State } from './types';
import useColumnType from './useColumnType';
import useDefaultValues from './useDefaultValues';
import useIntermediateMemo from './useIntermediateMemo';
import usePagination from './usePagination';
import useSearch from './useSearch';
import useSort from './useSort';
import useVisibility from './useVisibility';
import { makeHeaders, makeOriginalRows, makeRows } from './util';

export default function useTable<T extends ColumnTypes>(
  columns: Columns<T>,
  data?: Data<T>,
  options?: Options<T>,
): State<T> {
  const columnsMemo = useIntermediateMemo(columns);
  const dataMemo = useIntermediateMemo(data ?? []);
  const optionsMemo = useIntermediateMemo(options ?? {});

  // Calculate which columns should be visible
  const { visibility, setVisibility, setAllVisibility } = useVisibility(columnsMemo);

  // Set undefined values to defaultvalue
  const { defaultValuesData } = useDefaultValues(dataMemo, columnsMemo);

  // Find the runtime type of each column
  const { columnType } = useColumnType(columnsMemo, defaultValuesData);

  // Search filter the data
  const { searchedData, searchString, setSearchString, searchResultCount, highlight } = useSearch(
    columnsMemo,
    defaultValuesData,
    visibility,
    columnType,
    optionsMemo.search,
  );

  // Sort the searched data
  const { sortedData, sortInfo, sort } = useSort(
    columnsMemo,
    searchedData,
    columnType,
    optionsMemo.sort,
  );

  // Paginate the searched, sorted data
  const { paginatedData, page, pageAmount, setPage } = usePagination(
    sortedData,
    optionsMemo.pagination,
  );

  // Set page to 0 if sorted data updates
  useEffect(() => {
    if (optionsMemo.pagination?.pageSize !== undefined) setPage(0);
  }, [sortedData, optionsMemo, setPage]);

  const { headers, originalHeaders } = useMemo(
    () => makeHeaders(columnsMemo, visibility, setVisibility, sortInfo, sort, optionsMemo),
    [columnsMemo, visibility, setVisibility, sortInfo, sort, optionsMemo],
  );

  const originalRows = useMemo(
    () => makeOriginalRows(columnsMemo, dataMemo, highlight),
    [columnsMemo, dataMemo, highlight],
  );

  const rows = useMemo(
    () => makeRows(columnsMemo, paginatedData, visibility, highlight, optionsMemo),
    [columnsMemo, paginatedData, visibility, highlight, optionsMemo],
  );

  return {
    originalHeaders,
    headers,
    originalRows,
    rows,
    visibilityHelpers: {
      hideAll: () => setAllVisibility(false),
      showAll: () => setAllVisibility(true),
    },
    paginationHelpers: {
      page,
      pageSize: optionsMemo.pagination?.pageSize ?? searchResultCount,
      pageAmount,
      setPage,
      setFirstPage: () => setPage(0),
      setLastPage: () => setPage(pageAmount - 1),
      canPrev: page > 0,
      prevPage: () => setPage(page - 1),
      canNext: page < pageAmount - 1,
      nextPage: () => setPage(page + 1),
    },
    searchHelpers: {
      searchString,
      setSearchString,
      searchResultCount,
    },
  };
}
