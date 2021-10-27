import { useEffect, useState } from 'react';
import { Columns, ColumnTypes, Data } from './types';
import { getRowValue } from './util';

interface ColumnTypeState<T extends ColumnTypes> {
  columnType: ColumnType<T>;
}

export enum ColumnTypeEnum {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  UNDEFINED = 'UNDEFINED',
  COMPLEX = 'COMPLEX',
}

export type ColumnType<T extends ColumnTypes> = {
  [P in keyof T]: ColumnTypeEnum;
};

function findColumnType<T extends ColumnTypes>(
  data: Data<T>,
  columnName: string,
): ColumnTypeEnum {
  for (const row of data) {
    const type = typeof getRowValue(row, columnName);
    switch (type) {
      case 'undefined':
        continue;
      case 'string':
        return ColumnTypeEnum.STRING;
      case 'number':
        return ColumnTypeEnum.NUMBER;
      case 'boolean':
        return ColumnTypeEnum.BOOLEAN;
      default:
        return ColumnTypeEnum.COMPLEX;
    }
  }

  return ColumnTypeEnum.UNDEFINED;
}

function getState<T extends ColumnTypes>(
  data: Data<T>,
  columns: Columns<T>,
): ColumnType<T> {
  return Object.keys(columns).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: findColumnType(data, curr),
    }),
    {} as ColumnType<T>,
  );
}

export default function useColumnType<T extends ColumnTypes>(
  columns: Columns<T>,
  data: Data<T>,
): ColumnTypeState<T> {
  const [columnType, setColumnType] = useState(getState(data, columns));

  useEffect(() => {
    const newState = getState(data, columns);
    if (JSON.stringify(newState) !== JSON.stringify(columnType))
      setColumnType(newState);
  }, [data, columns]);

  return { columnType };
}
