import { Packages } from './scripts/generate';

export const packages: Packages = {
  'react-form': {
    description:
      'A headless, declarative, lightweight form engine for React apps with first-class TypeScript support.',
    keywords: ['typescript', 'react', 'hook', 'form', 'validation', 'headless'],
    features: [
      { icon: '✅', text: 'CommonJS and ES Modules support' },
      { icon: '👍', text: 'Easy, declarative form definition with strong typescript support' },
      {
        icon: '😎',
        text: 'Best HTML form practices are the default, with advanced form validation out-of-the-box',
      },
      {
        icon: '⚖️',
        text: 'Lightweight; [minified + gzipped](https://bundlephobia.com/package/@saphe/react-form) (esm, cjs, and types combined) and only 1 dependency in total',
      },
      {
        icon: '🎨',
        text: 'Headless; you decide the form style, the hook handles the complex internal logic',
      },
      {
        icon: '🔌',
        text: 'Completely and easily extendable using plugins, and many officially maintained plugins available',
      },
    ],
    roadmap: [
      { text: '(in-place) field modifiers: transform / strip a string, round a number' },
      { text: 'FormValues type modifiers: return field names as snake case or as FormData object' },
      { text: 'Support state functions (e.g. `state: FieldState | (formState) => FieldState`)' },
      { text: 'More advanced form validation (e.g. require either one of two fields to be set)' },
      { text: 'Some sort of dirty fields api' },
      { text: 'Some sort of i18n api' },
    ],
  },

  'react-form-fields-bootstrap': {
    description: 'Officially maintained Bootstrap-style form fields pack for @saphe/react-form',
    keywords: ['typescript', 'react', 'form', 'bootstrap'],
    peerDependencies: ['bootstrap'],
  },

  'react-table': {
    description: 'A lightweight, declarative, type-safe table engine for React apps.',
    keywords: ['typescript', 'react', 'hook', 'table', 'tables'],
    features: [
      { icon: '✅', text: 'CommonJS and ES Modules support' },
      { icon: '🤩', text: 'Easily sort by columns' },
      { icon: '⏭️', text: 'Built-in pagination logic' },
      { icon: '🔍', text: 'Exact and fuzzy text search with match highlighting out-of-the-box' },
      { icon: '👁️', text: 'Toggle visibility on columns using the provided utility functions' },
      {
        icon: '⚖️',
        text: 'Lightweight; [6.3 kB minified + gzipped](https://bundlephobia.com/package/@saphe/react-table) (esm and cjs combined) and only 2 dependencies total',
      },
      { icon: '🚀', text: 'Efficient due to usage of internal memoization and effect order' },
      { icon: '🎨', text: 'Headless; you decide the table style, the hook handles the logic' },
    ],
    roadmap: [
      { checked: true, text: 'Rename `hidden` to `visibility`' },
      { checked: true, text: 'Remove `invert` from sorting functions' },
      { checked: true, text: 'Update default SortOrder' },
      { checked: true, text: 'Custom order of SortOrder enum (global and local)' },
      { checked: true, text: 'Expose state interfaces' },
      { checked: true, text: 'Does pagination start at 1 or 0? (answer: 0)' },
      { text: 'Do a performance analysis' },
      { text: 'Rewrite the main body using useReducer' },
      { text: 'Search debounce' },
      { text: 'RegEx search mode (?)' },
      { text: 'Add support for table styling packs' },
      { text: 'API data fetching functionality for sort, search, and pagination' },
      { text: 'Plugin support' },
    ],
    examples: [
      {
        title: 'Basic',
        href: 'https://codesandbox.io/s/saphe-react-table-basic-usage-example-eewu2?file=/src/App.tsx',
      },
      {
        title: 'Pagination / Hiding columns (Bootstrap 5)',
        href: 'https://codesandbox.io/s/saphe-react-table-pagination-visibility-usage-example-32s7v?file=/src/App.tsx',
      },
      {
        title: 'Searchable / Sortable table (Material Design)',
        href: 'https://codesandbox.io/s/saphe-react-table-search-sort-usage-example-m9uev',
      },
      {
        title: 'Kitchen Sink (Tailwind CSS)',
        href: 'https://codesandbox.io/s/saphe-react-table-kitchen-sink-example-wq7xq',
      },
    ],
  },

  'react-use': {
    description: 'A collection of tiny, useful, type-safe React hooks.',
    keywords: ['typescript', 'react', 'hooks', 'type-safe', 'use'],
    features: [
      { icon: '⚖️', text: 'Incredibly lightweight, only ~150 LOC per hook (including types)' },
      { icon: '🌳', text: 'Tree-shakable, only include in the bundle what is necessary' },
      { icon: '👍', text: 'All hooks have a sophisticated type system powering them' },
      { icon: '✔️', text: '100% test coverage' },
      { icon: '0️⃣', text: '0 dependencies' },
    ],
  },
};
