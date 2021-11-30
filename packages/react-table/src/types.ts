import { ReactElement } from 'react';
import { DefaultValue } from './useDefaultValues';
import { MatchedText } from './useSearch';

/** The sorting state of a column */
export enum SortOrder {
  /** Sort data in this column in ascending order */
  ASC = 'ASC',
  /** Sort data in this column in descending order */
  DESC = 'DESC',
  /** Don't sort the data in this column */
  UNSORTED = 'UNSORTED',
}

/** How a search is performed on a table */
export enum SearchMode {
  /** Only show result if a substring in the row matches exactly with the search string */
  EXACT = 'EXACT',
  /** Show result if a value in the row fuzzily matches with the search string. For more info: https://www.npmjs.com/package/fuzzysort */
  FUZZY = 'FUZZY',
  // REGEX? https://stackoverflow.com/questions/9127498/how-to-perform-a-real-time-search-and-filter-on-a-html-table
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export interface RenderHeadProps {
  name: string;
  label: string;
  hidden: boolean;
  toggleVisibility?: (value?: boolean) => void;
  sortOrder: SortOrder;
  toggleSort?: (order?: SortOrder) => void;
}

export interface RenderCellProps<T extends ColumnTypes = Any, U = Any> {
  row: DataRow<T>;
  value: U;
  stringValue: string;
  matchedText: MatchedText;
}

/** User input object for column configuration */
export interface Column<T extends ColumnTypes, U = Any> {
  /** Optional: name shown at the top of the column */
  label?: string;
  /** Optional: the value that should replace undefined at runtime */
  defaultValue?: DefaultValue<T, U>;
  /** Optional (default = `false`): don't show this column at all */
  hidden?: boolean;
  /** Optional (default = `false`): user is not able to hide this column */
  unhideable?: boolean;
  /** Optional: custom sorting function for this column */
  sort?: (a: U, b: U) => number;
  /** Optional: (default = global configuration): override of the order in which SortOrders appear through `toggleSort` */
  sortOrder?: SortOrder[];
  /** Optional (default = `false`): user is not able to sort this column */
  unsortable?: boolean;
  /** Optional: convert cell content to string for string matching / searching purposes */
  stringify?: (value: U, row: DataRow<T>) => string;
  /** Optional (default = `false`): user is not able to search this column */
  unsearchable?: boolean;
  /** Optional: overrides how the header cell of this column renders */
  renderHead?: (props: RenderHeadProps) => ReactElement;
  /** Optional: overrides how the cells in this column render */
  renderCell?: (props: RenderCellProps<T, U>) => ReactElement;
}

/** User input object for options configuration */
export interface Options<T extends ColumnTypes> {
  /** Optional: enable pagination with `n` size pages*/
  pageSize?: number;
  /** Optional: settings for the table search module */
  search?: {
    /** Optional (default = `SearchMode.FUZZY`): the text matching algorithm used to search the table */
    mode?: SearchMode;
    // /** Optional (default = `false`): debounce the search input. Useful for large datasets which take more time to search */
    // debounce?: boolean;
  };
  /** Optional: settings for the table sorting module */
  sort?: {
    /** Optional (default = `[SortOrder.ASC, SortOrder.DESC, SortOrder.UNSORTED]`): the order in which SortOrders appear through `toggleSort` */
    order?: SortOrder[];
  };
  /** Optional: set default styling for the table elements */
  style?: {
    /** Optional: specifies how the header cells of the columns render by default */
    renderHead?: (props: RenderHeadProps) => ReactElement;
    /** Optional: specifies how the cells in the columns render by default */
    renderCell?: (props: RenderCellProps<T>) => ReactElement;
  };
}

/** Global state utilities for managing column visibility */
export interface VisibilityHelpers {
  /** Utility function to hide all hideable columns */
  hideAll: () => void;
  /** Utility function to show all showable columns */
  showAll: () => void;
}

/** Global state utilities for managing table pagination */
export interface PaginationHelpers {
  /** Current page number (between 1 and `pageAmount`) */
  page: number;
  /** Amount of pages */
  pageAmount: number;
  /** Utility function to set the current page if possible */
  setPage: (pageNumber: number) => void;
  /** Utility function to move to the next page if possible */
  nextPage: () => void;
  /** Whether or not there is a next page to go to */
  canNext: boolean;
  /** Utility function to move to the previous page if possible */
  prevPage: () => void;
  /** Whether or not there is a previous page to go to */
  canPrev: boolean;
}

/** Global state utilities for managing data searching */
export interface SearchHelpers {
  /** String which the table is being searched on */
  searchString: string;
  /** Utility function to set the search string */
  setSearchString: (value: string) => void;
  /** Total number of results after filtering by search string */
  searchResultCount: number;
}

/** Processed headers, used for displaying in the table */
export interface Header extends RenderHeadProps {
  render: () => ReactElement;
}

/** Original headers, used for external data manipulation */
export interface OriginalHeader extends RenderHeadProps {}

/** Processed rows, used for displaying in the table */
export interface Row<T extends ColumnTypes> {
  cells: (RenderCellProps<T> & { render: () => ReactElement })[];
}

/** Original rows, used for external data analysis and aggregation */
export interface OriginalRow<T extends ColumnTypes> {
  originalCells: RenderCellProps<T>[];
}

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
  /** Visibility columns helpers */
  visibilityHelpers: VisibilityHelpers;
  /** Pagination helpers */
  paginationHelpers: PaginationHelpers;
  /** Search helpers */
  searchHelpers: SearchHelpers;
}

/** User input type for column type configuration */
export interface ColumnTypes {
  [columnName: string]: Any;
}

/** User input object for column configuration */
export type Columns<T extends ColumnTypes> = {
  [P in keyof T]: Column<T, T[P]>;
};

/** Data input object */
export type Data<T extends ColumnTypes> = Array<DataRow<T>>;

/** User input object for data row configuration */
export type DataRow<T extends ColumnTypes> = Partial<Pick<T, DataRowOptionals<T>>> &
  Omit<T, DataRowOptionals<T>>;

type DataRowOptionals<T extends ColumnTypes> = {
  [K in keyof T]: null extends T[K] ? K : undefined extends T[K] ? K : never;
}[keyof T];
