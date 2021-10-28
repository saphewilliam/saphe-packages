import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { Column, Columns, ColumnTypes } from './types';

export type Visibility<T extends ColumnTypes> = {
  [P in keyof T]: boolean;
};

interface VisibilityState<T extends ColumnTypes> {
  visibility: Visibility<T>;
  setVisibility: Dispatch<SetStateAction<Visibility<T>>>;
  setAllVisibility: (value: boolean) => void;
}

function getVisibility<T extends ColumnTypes>(
  columns: Columns<T>,
  prevVisibility?: Record<string, boolean> | boolean,
): Visibility<T> {
  const visibility: Record<string, boolean> = {};

  for (const [name, args] of Object.entries<Column<T>>(columns)) {
    let prevColVisibility: boolean | undefined;

    if (prevVisibility !== undefined) {
      if (typeof prevVisibility === 'boolean') prevColVisibility = prevVisibility;
      else prevColVisibility = prevVisibility[name];
    }

    if (args.hidden !== undefined) visibility[name] = !args.hidden;
    else if (args.unhideable === true) visibility[name] = true;
    else if (prevColVisibility !== undefined) visibility[name] = prevColVisibility;
    else visibility[name] = true;
  }

  return visibility as Visibility<T>;
}

export default function useVisibility<T extends ColumnTypes>(
  columns: Columns<T>,
): VisibilityState<T> {
  const [visibility, setVisibility] = useState(getVisibility(columns));

  useEffect(() => {
    const newVisibility = getVisibility(columns, visibility);
    if (JSON.stringify(newVisibility) !== JSON.stringify(visibility)) setVisibility(newVisibility);
  }, [columns]);

  const setAllVisibility = useCallback(
    (value: boolean) => setVisibility(getVisibility(columns, value)),
    [columns],
  );

  return { visibility, setVisibility, setAllVisibility };
}
