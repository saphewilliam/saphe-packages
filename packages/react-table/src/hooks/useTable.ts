import { useAsyncReducer } from '@saphe/react-use';
import {
  ColumnTypes,
  // Columns,
  // Data,
  // Options,
  // State,
  Header,
  OriginalHeader,
  Row,
  OriginalRow,
} from '../lib/types';
import { Plugin } from '../lib/plugin';
import { paginationClient } from '../plugins';

type Plugins = Array<Plugin<any, any, any, any, any>>;

/** Output table state object */
export interface State<P extends Plugins, T extends ColumnTypes> {
  /** Processed headers, used for displaying in the table */
  headers: Header[];
  /** Original headers, used for external data manipulation */
  originalHeaders: OriginalHeader[];
  /** Processed rows, used for displaying in the table */
  rows: Row<T>[];
  /** Original rows, used for external data analysis */
  originalRows: OriginalRow<T>[];
  helpers: P extends Array<infer V> ? {[K in V as K extends Plugin<infer Name, any, any, any, any> ? Name & string : 'hello']: string} : never;
}

const iets = useTable([paginationClient]);
iets.helpers?.

export default function useTable<P extends Plugins, T extends ColumnTypes>(
  plugins: P,
): // columns: Columns<T>,
// data?: Data<T>,
// options?: Options<T>,
State<P, T> {
  // console.log(Object.entries(columns));

  const { state } = useAsyncReducer(
    {
      headers: [] as Header[],
      originalHeaders: [] as OriginalHeader[],
      rows: [] as Row<T>[],
      originalRows: [] as OriginalRow<T>[],
    },
    {},
  );

  return {
    ...state,
  };
}
