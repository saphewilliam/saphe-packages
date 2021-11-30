# @saphe/react-table

[![NPM version](https://img.shields.io/npm/v/@saphe/react-table?style=flat-square)](https://npmjs.com/@saphe/react-table)
[![License](https://img.shields.io/npm/l/@saphe/react-table?style=flat-square)](https://github.com/saphewilliam/saphe-packages/blob/main/LICENSE)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@saphe/react-table?style=flat-square)](https://bundlephobia.com/package/@saphe/react-table)
[![Pull requests welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/saphewilliam/saphe-packages/blob/main/CONTRIBUTING.md)

A lightweight, declarative, type-safe table engine for React apps.

## Features

- ✅ CommonJS and ES Modules support,
- 🤩 Easily sort by columns,
- ⏭️ Built-in pagination logic,
- 🔍 Exact and fuzzy text search with match highlighting out-of-the-box,
- 👁️ Toggle visibility on columns using the provided utility functions,
- ⚖️ Lightweight; [6.3 kB minified + gzipped](https://bundlephobia.com/package/@saphe/react-table) (esm and cjs combined) and only 2 dependencies total,
- 🚀 Efficient due to usage of internal memoization and effect order,
- 🎨 Headless; you decide the table style, the hook handles the logic.

## Table of Contents

- [Roadmap](#roadmap)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Docs](#docs)
  * [Basic Usage](#basic-usage)
  * [Pagination](#pagination)
  * [Dynamically and Statically Hiding Columns](#dynamically-and-statically-hiding-columns)
  * [Sorting by Columns](#sorting-by-columns)
  * [Searching a Table](#searching-a-table)
- [Troubleshooting](#troubleshooting)
  * [Invalid React Child](#invalid-react-child)
  * [Maximum Update Depth](#maximum-update-depth)

## Roadmap

- [x] Rename `hidden` to `visibility`
- [x] Remove `invert` from sorting functions
- [x] Update default SortOrder
- [x] Custom order of SortOrder enum (global and local)
- [x] Expose state interfaces
- [x] Does pagination start at 1 or 0? (answer: 0)
- [ ] Do a performance analysis
- [ ] Check if the code would be cleaner/faster using useReducer (probably)
- [ ] Search debounce
- [ ] RegEx search mode (?)
- [ ] Add support for table styling packs
- [ ] API data fetching functionality for sort, search, and pagination
- [ ] Plugin support

## Getting Started

Install using yarn:

```sh
yarn add @saphe/react-table
```

or using npm:

```sh
npm install @saphe/react-table
```

## Examples

- [Basic](https://codesandbox.io/s/saphe-react-table-basic-usage-example-eewu2?file=/src/App.tsx)
- [Pagination / Hiding columns (Bootstrap 5)](https://codesandbox.io/s/saphe-react-table-pagination-visibility-usage-example-32s7v?file=/src/App.tsx)
- [Searchable / Sortable table (Material Design)](https://codesandbox.io/s/saphe-react-table-search-sort-usage-example-m9uev)
- [Kitchen Sink (Tailwind CSS)](https://codesandbox.io/s/saphe-react-table-kitchen-sink-example-wq7xq)

<!-- END AUTO-GENERATED: Add custom documentation after this comment -->

## Docs

### Basic Usage

The following code shows a basic functional React component that implements a table using the `useTable` hook. Feel free to open the [Basic Example](https://codesandbox.io/s/saphe-react-table-basic-usage-example-eewu2?file=/src/App.tsx) and type along to see the IntelliSense and TypeChecking do it's thing! It is also possible to define `ColumnTypes`, `columns` and `data` in-line with the `useTable` function, but here they're shown separately to demonstrate the use of the `Columns<T>` and `Data<T>` types.

```tsx
import React, { ReactElement } from 'react';
import useTable, { Columns, Data } from '@saphe/react-table';

// Define column types of this table
interface ColumnTypes {
  language: string;
  stronglyTyped: boolean | null;
  jobs: { amount: number; salary: number };
}

export default function ProgrammingLanguagesTable(): ReactElement {
  
  // Column configuration of the table
  const columns: Columns<ColumnTypes> = {

    // Pass empty object to accept all default values
    language: {},
    
    // Set default value for nullable column type
    stronglyTyped: { defaultValue: false },
    jobs: {
      
      // Define custom label for column header
      label: 'Job Stats',

      // Define how the `jobs` object should be stringified. If skipped, it shows `[object Object]`
      stringify: ({ amount, salary }) => {
        const sep = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${sep(amount)} jobs with $${sep(salary)} salary`;
      },
    },
  };

  // Define the data shown in the table
  // Data from: https://www.northeastern.edu/graduate/blog/most-popular-programming-languages/
  const data: Data<ColumnTypes> = [
    { language: 'Python', jobs: { amount: 19000, salary: 120000 } },
    { language: 'JavaScript', jobs: { amount: 24000, salary: 118000 } },
    { language: 'Java', jobs: { amount: 29000, salary: 104000 }, stronglyTyped: true },
    { language: 'C#', jobs: { amount: 18000, salary: 97000 }, stronglyTyped: true },
    { language: 'C', jobs: { amount: 8000, salary: 97000 }, stronglyTyped: true },
    { language: 'C++', jobs: { amount: 9000, salary: 97000 }, stronglyTyped: true },
    { language: 'GO', jobs: { amount: 1700, salary: 93000 }, stronglyTyped: true },
    { language: 'R', jobs: { amount: 1500, salary: 93000 } },
    { language: 'Swift', jobs: { amount: 1800, salary: 93000 }, stronglyTyped: true },
    { language: 'PHP', jobs: { amount: 7000, salary: 81000 } },
  ];

  // Use the hook and obtain the headless headers and rows
  const { headers, rows } = useTable(columns, data);

  // Use the headers and rows to display a table according to your own styling
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <header.render key={i} />
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.cells.map((cell, j) => (
              <cell.render key={j} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Pagination

To enable pagination in your table, pass a number to the `pageSize` option through the options object of the `useTable` hook. You can now extract a `paginationHelpers` object from the `useTable` state with the following properties:

```ts
interface PaginationHelpers {
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
```

You can then use these headless utilities to build your own pagination interface:

```tsx
const { headers, rows, paginationHelpers } = useTable(columns, data, { pageSize: 10 });

return (
  <section>
    <Table {...{ headers, rows }} />

    <div>
      <button disabled={!paginationHelpers.canPrev} onClick={paginationHelpers.prevPage}>
        Previous page
      </button>

      <span>
        Page {paginationHelpers.page} of {paginationHelpers.pageAmount}
      </span>
      
      <button disabled={!paginationHelpers.canNext} onClick={paginationHelpers.nextPage}>
        Next page
      </button>
    </div>
  </section>
)
```

### Dynamically and Statically Hiding Columns

You can statically hide columns by defining them as `hidden: true` in the column definition. If a column is statically hidden, then it is not present in the `headers` state array. You will need to use `originalHeaders` from the `useTable` state to access it.

You can dynamically hide columns using the `visibilityHelpers` object on the useTable state. It has the following properties: 

```ts
interface VisibilityHelpers {
  /** Utility function to hide all hideable columns */
  hideAll: () => void;
  /** Utility function to show all showable columns */
  showAll: () => void;
}
```

You can then toggle column visibility using the `toggleVisibility` function in the headers.

If you want to make it impossible to hide a column, define it as `unhideable: true` in the column definition. An unhideable column does not have a `toggleVisibility` function.

```tsx
const { headers, originalHeaders, rows, visibilityHelpers } = useTable(columns, data);

return (
  <section>
    <div>

      {/* Map over the original headers to create a checkbox-based dynamic column visibility UI element */}
      {originalHeaders.map((header, i) => (
        <label htmlFor={`visibilityCheckBox${i}`} key={i}>
          <input
            type="checkbox"
            name={`visibilityCheckBox${i}`}
            id={`visibilityCheckBox${i}`}
            
            {/* If `toggleVisibility` is undefined, then this column is `unhideable` */}
            disabled={!header.toggleVisibility}
            checked={!header.hidden}
            onChange={() => header.toggleVisibility && header.toggleHide()}
          />
          <span>{header.label}</span>
        </label>
      ))}
    </div>

    <button onClick={visibilityHelpers.showAll}>Show All</button>
    <button onClick={visibilityHelpers.hideAll}>Hide All</button>

    <Table {...{ headers, rows }} />
  </section>
)
```

### Sorting by Columns

Sorting a column can be as simple as calling the `toggleSort` function on the header cell. This will cycle the column through 3 states by default: SortOrder.ASC, SortOrder.DESC, and SortOrder.UNSORTED, in that order. To house this logic, you can define a custom clickable header cell:

```tsx
import React, { ReactElement } from 'react';
import { RenderHeadProps, SortOrder } from '@saphe/react-table';

export function SortableHeaderCell(props: RenderHeadProps): ReactElement {
  const getArrow = (order: SortOrder) => {
    switch (order) {
      case SortOrder.ASC:
        return '^';
      case SortOrder.DESC:
        return 'v';
      case SortOrder.UNSORTED:
        return '';
    }
  };

  return (
    <th onClick={() => props.toggleSort && props.toggleSort()}>
      {props.label} {getArrow(props.sortOrder)}
    </th>
  );
}
```

Then you can pass it to `useTable` using the options object, as well as a custom order of SortOrders.

```tsx
const { headers, rows } = useTable(columns, data, { 
  style: { renderHead: SortableHeaderCell },
  // Omit `SortOrder.UNSORTED` at the end to loop the custom order
  sort: { order: [SortOrder.DESC, SortOrder.UNSORTED, SortOrder.ASC] },
});

return <Table {...{ headers, rows }} />
```

If you have a complex data object (not string, number or boolean), you can either turn off sorting for that column using the `unsortable: true` option in the column definition, or supply a custom sorting function using the `sort` option in the column definition. For examples on custom sorting functions, check the [useSort hook](https://github.com/saphewilliam/saphe-packages/blob/develop/packages/react-table/src/useSort.ts#L36-L48) in the GitHub repo.

### Searching a Table

To enable table searching, extract from the `useTable` state a `searchHelpers` object with the following properties:

```ts
interface SearchHelpers {
  /** String which the table is being searched on */
  searchString: string;
  /** Utility function to set the search string */
  setSearchString: (value: string) => void;
  /** Total number of results after filtering by search string */
  searchResultCount: number;
}
```

If you wish to exclude a column from the search, set its `unsearchable` option to `true`.

To set the search mode from the default fuzzy search `SearchMode.FUZZY` to exact string matching `SearchMode.EXACT`, pass the desired search mode into the `search.mode` key of the `options` object.

If you want to highlight the matched text in the search results, you can pass in a custom component through the `style.renderCell` key of the `options` object which addresses the requirement. This custom component may use the `matchedText` prop from the `RenderCellProps` type as follows:

```tsx
import React, { ReactElement } from 'react';
import { RenderCellProps } from '@saphe/react-table';

export function HighlightCell(props: RenderCellProps): ReactElement {
  return (
    <td>
      {props.matchedText.map(({ highlighted, value }, idx) => (
        <span key={idx} style={{ backgroundColor: highlighted ? '#f7d40a' : '#fff' }}>
          {value}
        </span>
      ))}
    </td>
  );
}
```

You can now use the headless utilities to build your own search input:

```tsx
const { headers, rows, searchHelpers } = useTable(columns, data, { 
  search: { mode: SearchMode.FUZZY },
  style: { renderCell: HighlightCell },
});

return (
  <section>
    <div>
      <label htmlFor="searchTable">Search</label>
      <input
        type="text"
        autoComplete="off"
        name="searchTable"
        id="searchTable"
        placeholder="Search table..."
        value={searchHelpers.searchString}
        onChange={(e) => searchHelpers.setSearchString(e.target.value)}
      />
    </div>

    <Table {...{ headers, rows }} />
  </section>
)
```

## Troubleshooting

### Invalid React Child

If you encounter the `Objects are not valid as a React child` error, it means you are trying to make a custom cell and are directly rendering an object-type data value. React is not happy when you do that, you have to convert the object into a string first. There are two ways to do this:

The first is to use the default preconfigured cell and implement a `stringify` function in the column definition, like this:

```tsx
interface ColumnTypes {
  objectColumn: { key1: string; key2: number };
}

export default function ObjectTable(): ReactElement {
  const { headers, rows } = useTable({
    objectColumn: { 
      // Stringify definition!
      stringify: ({ key1, key2 }) => `${key2}: ${key1}` 
    },
  }, [
    { key1: 'test value', key2: 10 },
    { key1: 'another value', key2: 3 },
  ]);

  return <Table {...{ headers, rows }} />
}
```

The second way is to define a custom cell function, and stringify the value in it, or to use the `stringValue` prop from `RenderCellProps`, which takes the column's stringify function into account.

```tsx
export function ObjectCell(props: RenderCellProps): ReactElement {
  // Either to this:
  return (
    <td>{`${value.key2}: ${value.key1}`}</td>
  )

  // Or this (and define a top-level stringify function like in the previous code block)
  return (
    <td>{props.stringValue}</td>
  )
}
```

### Maximum Update Depth

If you encounter the `Maximum update depth exceeded` error, it probably means that you're trying to render data that recursively triggers table re-renders, for instance: `new Date()`. There are two fixes for this error.

One is to wrap your data array and/or column definition in a [`useMemo` hook](https://reactjs.org/docs/hooks-reference.html#usememo) before passing them to `useTable`, like this:

```tsx
interface ColumnTypes {
  dateColumn: Date | null;
  dateRow: Date;
}

export default function DateTable(): ReactElement {
  const columns: Columns<ColumnTypes> = useMemo(() => ({
    dateColumn: { defaultValue: new Date() },
    dateRow: {},
  }), []);

  const data: Data<ColumnTypes> = useMemo(() => [
    { dateRow: new Date() },
  ], []);

  const { headers, rows } = useTable(columns, data);

  return <Table {...{ headers, rows }} />
}
```

The other fix is to define the data outside of the react component (only an option if your data is independent from the component state), like this:

```tsx
interface ColumnTypes {
  dateColumn: Date | null;
  dateRow: Date;
}

const columns: Columns<ColumnTypes> = {
  dateColumn: { defaultValue: new Date() },
  dateRow: {},
};

const data: Data<ColumnTypes> = [{ dateRow: new Date() }];

export default function DateTable(): ReactElement {
  const { headers, rows } = useTable(columns, data);

  return <Table {...{ headers, rows }} />
}
```
