import { useCallback, useMemo, useState } from 'react';
import { Columns, ColumnTypes, Data, Options, DataRow, SortOrder } from './types';
import { ColumnType, ColumnTypeEnum } from './useColumnType';
import { getRowValue } from './util';

export type SortInfo = {
  order: SortOrder;
  orderIndex: number;
  columnName: string;
} | null;

interface SortState<T extends ColumnTypes> {
  sortedData: Data<T>;
  sortInfo: SortInfo;
  sort: (columnName: string) => void;
}

function sortWrapper<T extends ColumnTypes, U>(
  sort: (a: U, b: U) => number,
  a: DataRow<T>,
  b: DataRow<T>,
  sortInfo: SortInfo,
): number {
  if (!sortInfo) return 0;

  const invert = sortInfo.order === SortOrder.DESC;
  const aValue = getRowValue(a, sortInfo.columnName);
  const bValue = getRowValue(b, sortInfo.columnName);

  if (aValue === undefined && bValue === undefined) return 0;
  else if (aValue === undefined) return invert ? -1 : 1;
  else if (bValue === undefined) return invert ? 1 : -1;
  return (invert ? -1 : 1) * sort(aValue, bValue);
}

function sortNumbers(a: number, b: number): number {
  return a - b;
}

function sortStrings(a: string, b: string): number {
  return a.localeCompare(b);
}

function sortBooleans(a: boolean, b: boolean): number {
  if (a && !b) return 1;
  if (b && !a) return -1;
  return 0;
}

export default function useSort<T extends ColumnTypes>(
  columns: Columns<T>,
  data: Data<T>,
  columnType: ColumnType<T>,
  sortOptions?: Options<T>['sort'],
): SortState<T> {
  const [sortInfo, setSortInfo] = useState<SortInfo>(
    sortOptions?.initial
      ? {
          columnName: sortOptions.initial.column as string,
          order: sortOptions.initial.order,
          orderIndex: -1,
        }
      : null,
  );

  const sortedData = useMemo(() => {
    if (sortInfo !== null) {
      const { columnName } = sortInfo;
      const customSort = columns[columnName]?.sort;
      const stringify = columns[columnName]?.stringify;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const colType = columnType[columnName]!;

      if (!stringify && colType === null && customSort === undefined) {
        console.error(
          `Column '${columnName}' does not have a sorting or stringify function configured`,
        );
        return data;
      }

      if (sortInfo.order === SortOrder.UNSORTED) return data;

      return [...data].sort((a, b) => {
        if (customSort !== undefined) return sortWrapper(customSort, a, b, sortInfo);
        if (colType === ColumnTypeEnum.STRING) return sortWrapper(sortStrings, a, b, sortInfo);
        if (colType === ColumnTypeEnum.BOOLEAN) return sortWrapper(sortBooleans, a, b, sortInfo);
        if (colType === ColumnTypeEnum.NUMBER) return sortWrapper(sortNumbers, a, b, sortInfo);
        if (stringify) {
          const invert = sortInfo.order === SortOrder.DESC;
          const aValue = stringify(getRowValue(a, sortInfo.columnName), a);
          const bValue = stringify(getRowValue(b, sortInfo.columnName), b);

          return (invert ? -1 : 1) * sortStrings(aValue, bValue);
        }
        return 0;
      });
    } else return data;
  }, [columns, data, columnType, sortInfo]);

  const sort = useCallback(
    (columnName: string) => {
      const localOrders = columns[columnName]?.sortOrder;
      const globalOrders = sortOptions?.order;
      const defaultOrders = [SortOrder.ASC, SortOrder.DESC, SortOrder.UNSORTED];
      const sortOrders = localOrders ?? globalOrders ?? defaultOrders;
      if (sortOrders.length !== 0) {
        let index = sortInfo?.orderIndex;

        if (index === -1 && sortInfo?.columnName === columnName)
          index = sortOrders.indexOf(sortInfo.order);

        if (
          sortInfo?.columnName !== columnName ||
          index === undefined ||
          index === -1 ||
          index + 1 === sortOrders.length
        ) {
          index = 0;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setSortInfo({ columnName, orderIndex: index, order: sortOrders[index]! });
        } else
          setSortInfo({
            columnName,
            orderIndex: index + 1,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            order: sortOrders[index + 1]!,
          });
      }
    },
    [sortInfo, setSortInfo],
  );

  return { sortedData, sort, sortInfo };
}
