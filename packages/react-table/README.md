# @saphe/react-table

**⚠️ Currently in development**

A lightweight, declarative, type-safe table engine for React apps.

## Features

- 🤩 Easily sort by columns,
- 🔍 Exact and fuzzy text search with match highlighting out-of-the-box,
- ⏭️ Built-in pagination logic,
- 👁️ Toggle visibility on columns using the provided utility functions,
- ⚖️ Lightweight; only 150 kB unpacked and only 1 dependency,
- 🚀 Efficient due to usage of internal memoization and effect order,
- 🎨 Headless; you decide the table style, the hook handles the logic.

## TODOs

- [x] Rename `hidden` to `visibility`
- [ ] Updating default SortOrder
- [ ] Do a performance analysis
- [ ] Check if the code would be cleaner/faster using useReducer (probably)
- [ ] Access column configuration through RenderCellProps (mostly for stringify function)
- [ ] Search debounce
- [ ] Custom order of SortOrder enum (global and local)
- [ ] RegEx search mode (?)
- [ ] Add support for table styling packs
- [ ] API data fetching functionality for sort, search, and pagination instead of client-side data slicing

## Getting Started

Using yarn:

```sh
yarn add @saphe/react-table
```

or using npm:

```sh
npm install @saphe/react-table
```

## Examples (TODO)

- [Basic]()
- [Pagination / Hiding columns (Bootstrap)]()
- [Searchable / Sortable table (Material)]()
- [Kitchen Sink (TailwindCSS)]()

## Docs

### Basic Usage

The following code shows a basic functional React component that implements a table using the `useTable` hook. Feel free to open the [Basic Example]() and type along to see the IntelliSense and TypeChecking do it's thing! It is also possible to define `ColumnTypes`, `columns` and `data` in-line with the `useTable` function, but here they're shown separately to demonstrate the use of the `Columns<T>` and `Data<T>` types.

```tsx
import React, { ReactElement } from 'react';
import useTable, { Columns, Data } from '@saphe/react-table';

// Define column types of this table
interface ColumnTypes {
  language: string;
  jobs: { amount: number; salary: number };
  stronglyTyped: boolean;
}

export default function ProgrammingLanguagesTable(): ReactElement {

  // Column configuration of the table
  const columns: Columns<ColumnTypes> = {
    language: {},
    jobs: {
      label: 'Job Stats',

      // Define how the `jobs` object should be stringified. If skipped, it shows `[object Object]`
      stringify: ({ amount, salary }) => {
        const sep = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${sep(amount)} jobs with $${sep(salary)} salary`;
      },
    },
    stronglyTyped: { defaultValue: false },
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
  )
}
```

### Pagination

To enable pagination in your table, pass a number to the `pageSize` option through the options object of the `useTable` hook. You can now extract a `paginationHelpers` object from the `useTable` state with the following properties:

```ts
interface paginationHelpers {
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
interface visibilityHelpers<T extends ColumnTypes> {
  /** Object containing information about which columns are visible (false == hidden) */
  visibile: Visible<T>;
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

Sorting a column can be as simple as calling the `toggleSort` function on the header cell. This will cycle the column through 3 states: SortOrder.DESC, SortOrder.ASC, and SortOrder.UNSORTED, in that order. To house this logic, you can define a custom clickable header cell:

```tsx
import React, { ReactElement } from 'react';
import { RenderCellProps } from '@saphe/react-table';

export function SortableHeaderCell(props: RenderHeadProps): ReactElement {
  const getArrow = (order: SortOrder) => {
    switch order:
      case SortOrder.ASC:
        return '^';
      case SortOrder.DESC:
        return 'v';
      case SortOrder.UNSORTED:
        return '';
  }
  
  return (
    <th onClick={() => props.toggleSort && props.toggleSort()}>
      {props.label} {getArrow(props.sortOrder)}
    </th>
  );
}
```

Then you can pass it to `useTable` using the options object.

```tsx
const { headers, rows } = useTable(columns, data, { style: { renderHead: SortableHeaderCell } });

return <Table {...{ headers, rows }} />
```

If you have a complex data object (not string, number or boolean), you can either turn off sorting for that column using the `unsortable: true` option in the column definition, or supply a custom sorting function using the `sort` option in the column definition. For examples on custom sorting functions, check the [useSort hook](https://github.com/saphewilliam/saphe-packages/blob/develop/packages/react-table/src/useSort.ts#L35-L47) in the GitHub repo.

### Searching a Table

To enable table searching, extract from the `useTable` state a `searchHelpers` object with the following properties:

```ts
interface searchHelpers {
  /** String which the table is being searched on */
  searchString: string;
  /** Utility function to set the search string */
  setSearchString: Dispatch<SetStateAction<string>>;
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
