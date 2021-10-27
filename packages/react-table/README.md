# @saphe/react-table

**⚠️ Currently in development**

A lightweight, declarative, type-safe table engine for React apps.

## Features

- 🤩 Sort or show/hide columns with provided utility functions,
- ⏭️ Built-in pagination logic,
- 🔍 Exact and fuzzy text search with match highlighting out-of-the-box,
- 🎨 Headless; you decide the table style, we handle the logic.

## TODOs

- [] Do a performance analysis
- [] Check if the code would be cleaner/faster using useReducer (probably)
- [] Table styling packs
- [] Search debounce
- [] Fetching functionality for sort, search, and pagination instead of client-side data slicing

## Getting Started

Using yarn:

```sh
yarn add @saphe/react-table
```

or using npm:

```sh
npm install @saphe/react-table
```

## Examples

- [Basic]()
- [Pagination / Hiding columns (Bootstrap)]()
- [Searchable / Sortable table (Material)]()
- [Kitchen Sink (TailwindCSS)]()

## Docs

### Basic Usage

The following code shows a basic functional React component which implements a table using the `useTable` hook. Feel free to open the [Basic Example]() and type along to see the IntelliSense and TypeChecking do it's thing! It is also possible to define `ColumnTypes`, `columns` and `data` inline with the `useTable` function, but here they're shown separately to demonstrate the use of the `Columns<T>` and `Data<T>` types.

Basic functional react component
type along, see the errors, can also be done inline but we didn't to show how to use the types, 

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

To enable pagination in your table, pass a number to the `pageSize` option through the options object of the `useTable` hook. You can now extract a `paginationHelpers` object from the return object of `useTable` with the following properties:

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
    <table>{/* Table definition */}</table>
    <div>
      <button          
        disabled={!paginationHelpers.canPrev}
        onClick={paginationHelpers.prevPage}
      >
        Previous page
      </button>

      <span>
        Page {paginationHelpers.page} of {paginationHelpers.pageAmount}
      </span>
      
      <button
        disabled={!paginationHelpers.canNext}
        onClick={paginationHelpers.nextPage}
      >
        Next page
      </button>
    </div>
  </section>
)
```

### Dynamically and Statically Showing or Hiding Columns

```tsx
```

### Sorting by Columns

```tsx
```

### Searching Table

To enable table searching, extract from the `useTable` return object a `searchHelpers` object with the following properties:

```ts
interface searchHelpers {
  /** String which the table is being searched on */
  searchString: string;
  /** Utility function to set the search string */
  setSearchString: Dispatch<SetStateAction<string>>;
}
```

To set the search mode from the default fuzzy search `SearchMode.FUZZY` to exact string matching `SearchMode.EXACT`, pass the desired search mode into the `search.mode` key of the `options` object.

If you want to highlight the matched text in the search results, you can pass in a custom component through the `style.renderCell` key of the `options` object which addresses the requirement. This custom component may use the `matchedText` prop from the `RenderCellProps` type as follows:

```tsx
import React, { ReactElement } from 'react';
import { RenderCellProps } from '@saphe/react-table';

function HighlightCell(props: RenderCellProps): ReactElement {
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
  search: { mode: SearchMode.FUZZY},
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
    <table>{/* Table definition */}</table>
  </section>
)
```

## Contributing

// TODO 




<!--

### Validation Modes

Mode|Behavior
-|-
`ValidationModes.AFTER_BLUR` **(default)**|Don't validate a field until it has been blurred once, then validate it on change
`ValidationModes.ON_CHANGE`|Validate a field with every change
`ValidationModes.ON_BLUR`|Only validate the field once a user is done typing
`ValidationModes.ON_SUBMIT`|The field will only validate in the event of a form submission

You can assign a global validation mode by assigning it to the config object suppied to `useForm`. You can also assign field-specific validation modes by assigning them to the field config. The local validation modes take presidence over the global ones.

```ts
const form = useForm({
  // ...other form config
  validationMode: ValidationModes.ON_BLUR,
  fields: {
    fieldExample: {
      // ...other field config
      validation: {
        mode: ValidationModes.ON_CHANGE,
      },
    },
  },
});
```

-->
