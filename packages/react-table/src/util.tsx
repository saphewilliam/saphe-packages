import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import {
  Any,
  Column,
  Columns,
  ColumnTypes,
  Data,
  Options,
  RenderCellProps,
  RenderHeadProps,
  Row,
  SortOrder,
  State,
} from './types';
import { Hidden } from './useHidden';
import { MatchedText, HighlightFunc } from './useSearch';
import { SortInfo } from './useSort';

export function getRowValue<T extends ColumnTypes>(
  row: Row<T>,
  columnName: string,
): Any {
  return (row as Record<string, Any>)[columnName];
}

export function makeHeaders<T extends ColumnTypes>(
  columns: Columns<T>,
  hidden: Hidden<T>,
  setHidden: Dispatch<SetStateAction<Hidden<T>>>,
  sortInfo: SortInfo,
  sort: (columnName: string) => void,
  options?: Options<T>,
): {
  headers: State<T>['headers'];
  originalHeaders: State<T>['originalHeaders'];
} {
  const headers: State<T>['headers'] = [];
  const originalHeaders: State<T>['originalHeaders'] = [];

  for (const [name, args] of Object.entries<Column<T>>(columns)) {
    if (!args.hidden) {
      const defaultLabel: string = name
        .replace(/([A-Z])/g, (match) => ` ${match}`)
        .replace(/^./, (match) => match.toUpperCase())
        .trim();

      const defaultRenderHead = ({ label }: { label: string }) => (
        <th>{label}</th>
      );

      const {
        label = defaultLabel,
        renderHead = options?.style?.renderHead ?? defaultRenderHead,
        unhideable = false,
        unsortable = false,
      } = args;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const columnHidden = hidden[name]!;
      const toggleHide = (value?: boolean) =>
        setHidden({ ...hidden, [name]: value ?? !columnHidden });

      const header: RenderHeadProps = {
        name,
        label,
        hidden: columnHidden,
        toggleHide: !unhideable ? toggleHide : undefined,
        sortOrder:
          sortInfo?.columnName === name ? sortInfo.order : SortOrder.UNSORTED,
        toggleSort: !unsortable ? () => sort(name) : undefined,
      };

      originalHeaders.push(header);
      if (!columnHidden)
        headers.push({ ...header, render: () => renderHead(header) });
    }
  }

  return { headers, originalHeaders };
}

function makeRow<T extends ColumnTypes, U>(
  callback: (
    row: Row<T>,
    value: U,
    matchedText: MatchedText,
    columnsArgs: Column<T>,
    columnName: string,
  ) => U | null,
  columns: Columns<T>,
  row: Row<T>,
  highlight: HighlightFunc,
): U[] {
  const cells: U[] = [];

  for (const [columnName, columnArgs] of Object.entries<Column<T>>(columns)) {
    if (!columnArgs.hidden) {
      const value = getRowValue(row, columnName);
      const stringValue = columnArgs.stringify
        ? columnArgs.stringify(value, row)
        : String(value);
      const matched = highlight(stringValue);
      const cell = callback(row, value, matched, columnArgs, columnName);
      if (cell) cells.push(cell);
    }
  }

  return cells;
}

export function makeOriginalRows<T extends ColumnTypes>(
  columns: Columns<T>,
  data: Data<T>,
  highlight: HighlightFunc,
): State<T>['originalRows'] {
  const originalRows: State<T>['originalRows'] = [];

  for (const row of data) {
    const originalCells = makeRow<T, RenderCellProps<T>>(
      (row, value, matchedText) => ({ row, value, matchedText }),
      columns,
      row,
      highlight,
    );
    originalRows.push({ originalCells });
  }

  return originalRows;
}

export function makeRows<T extends ColumnTypes>(
  columns: Columns<T>,
  data: Data<T>,
  hidden: Hidden<T>,
  highlight: HighlightFunc,
  options?: Options<T>,
): State<T>['rows'] {
  const rows: State<T>['rows'] = [];

  for (const row of data) {
    const cells = makeRow<
      T,
      RenderCellProps<T> & { render: () => ReactElement }
    >(
      (row, value, matched, columnArgs, columnName) => {
        if (hidden[columnName]) return null;
        else {
          const defaultRenderCell = () => <td>{value}</td>;
          const renderCell =
            columnArgs.renderCell ??
            options?.style?.renderCell ??
            defaultRenderCell;

          const cell: RenderCellProps<T> = { value, row, matchedText: matched };
          return { ...cell, render: () => renderCell(cell) };
        }
      },
      columns,
      row,
      highlight,
    );

    rows.push({ cells });
  }

  return rows;
}
