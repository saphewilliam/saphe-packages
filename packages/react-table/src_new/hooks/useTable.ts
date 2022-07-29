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

/** Output table state object */
export interface State<T extends ColumnTypes> {
  /** Processed headers, used for displaying in the table */
  headers: Header[];
  /** Original headers, used for external data manipulation */
  originalHeaders: OriginalHeader[];
  /** Processed rows, used for displaying in the table */
  rows: Row<T>[];
  /** Original rows, used for external data analysis */
  originalRows: OriginalRow<T>[];
  // /** Visibility columns helpers */
  // visibilityHelpers: VisibilityHelpers;
  // /** Pagination helpers */
  // paginationHelpers: PaginationHelpers;
  // /** Search helpers */
  // searchHelpers: SearchHelpers;
  // ?? sortHelpers ??
}

export default function useTable<T extends ColumnTypes>(): // columns: Columns<T>,
// data?: Data<T>,
// options?: Options<T>,
State<T> {
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
