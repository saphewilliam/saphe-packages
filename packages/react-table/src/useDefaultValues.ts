import { useMemo } from 'react';
import { Columns, ColumnTypes, Data, DataRow } from './types';
import { getRowValue } from './util';

export type DefaultValue<T extends ColumnTypes, U> = U | ((row: DataRow<T>) => U);

export interface DefaultValuesState<T extends ColumnTypes> {
  defaultValuesData: Data<T>;
}

function getDefaultValue<T extends ColumnTypes, U>(
  defaultValue: DefaultValue<T, U>,
  row: DataRow<T>,
): U {
  if (typeof defaultValue !== 'function') return defaultValue;
  else return (defaultValue as (row: DataRow<T>) => U)(row);
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
              getDefaultValue(column.defaultValue, row) ??
              // Don't replace null by undefined if there is no default cell value set
              getRowValue(row, columnName),
          }),
          {} as DataRow<T>,
        ),
      ),
    [data, columns],
  );

  return { defaultValuesData };
}
