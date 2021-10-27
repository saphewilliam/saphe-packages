import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { Column, Columns, ColumnTypes } from './types';

export type Hidden<T extends ColumnTypes> = {
  [P in keyof T]: boolean;
};

interface HiddenState<T extends ColumnTypes> {
  hidden: Hidden<T>;
  setHidden: Dispatch<SetStateAction<Hidden<T>>>;
  setAllHidden: (hide: boolean) => void;
}

function getHidden<T extends ColumnTypes>(
  columns: Columns<T>,
  prevHidden?: Record<string, boolean> | boolean,
): Hidden<T> {
  const hidden: Record<string, boolean> = {};

  for (const [name, args] of Object.entries<Column<T>>(columns)) {
    let prevColHidden: boolean | undefined;

    if (prevHidden !== undefined) {
      if (typeof prevHidden === 'boolean') prevColHidden = prevHidden;
      else prevColHidden = prevHidden[name];
    }

    hidden[name] =
      args.hidden ?? (args.unhideable ? false : null) ?? prevColHidden ?? false;
  }

  return hidden as Hidden<T>;
}

export default function useHidden<T extends ColumnTypes>(
  columns: Columns<T>,
): HiddenState<T> {
  const [hidden, setHidden] = useState(getHidden(columns));

  useEffect(() => {
    const newHidden = getHidden(columns, hidden);
    if (JSON.stringify(newHidden) !== JSON.stringify(hidden))
      setHidden(newHidden);
  }, [columns]);

  const setAllHidden = useCallback(
    (value: boolean) => setHidden(getHidden(columns, value)),
    [columns],
  );

  return { hidden, setHidden, setAllHidden };
}
