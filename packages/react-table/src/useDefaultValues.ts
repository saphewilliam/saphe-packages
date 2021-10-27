import { useMemo } from 'react';
import { Columns, ColumnTypes, Data, Row } from './types';
import { getRowValue } from './util';

export type DefaultValue<T extends ColumnTypes, U> = U | ((row: Row<T>) => U);

export interface DefaultValuesState<T extends ColumnTypes> {
  defaultValuesData: Data<T>;
}

function getDefaultValue<T extends ColumnTypes, U>(
  defaultValue: DefaultValue<T, U>,
  row: Row<T>,
): U {
  if (typeof defaultValue !== 'function') return defaultValue;
  else return (defaultValue as (row: Row<T>) => U)(row);
}

export default function useDefaultValues<T extends ColumnTypes>(
  data: Data<T>,
  columns: Columns<T>,
): DefaultValuesState<T> {
  const defaultValuesData = useMemo<Data<T>>(
    () =>
      data.map((row) =>
        Object.entries(columns).reduce(
          (prev, [columnName, column]) => ({
            ...prev,
            [columnName]:
              getRowValue(row, columnName) ??
              getDefaultValue(column.defaultValue, row),
          }),
          {} as Row<T>,
        ),
      ),
    [data, columns],
  );

  return { defaultValuesData };
}
