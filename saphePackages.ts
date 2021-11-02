import { createWriteStream, existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import toc from 'markdown-toc';

const workspace: WorkspaceConfig = {
  name: 'saphe-packages',
  scope: 'saphe',
  license: 'MIT',
  author: {
    email: 'william@saphewebdesign.com',
    name: 'William Ford',
  },
  repository: {
    type: 'git',
    url: 'https://github.com/saphewilliam/saphe-packages.git',
  },
  packages: [
    {
      name: 'react-form',
      description: 'A lightweight, declarative, type-safe form engine for React apps.',
      keywords: ['typescript', 'react', 'hook', 'form', 'validation'],
      roadmap: [
        {
          checked: true,
          text: 'Eliminate native change and blur events in favor of minimalized custom ones so all intermediate values can be native types',
        },
        { text: 'Support lists of values' },
        { text: 'Support form layouts (advanced form field container with layout grid)' },
        {
          text: 'Field modifiers (transform a string to uppercase or round a number (floor or ceil))',
        },
        { text: 'Support localization out of the box' },
        { text: 'Create supported field packs:' },
        { checked: true, level: 1, text: 'Bootstrap 5' },
        { checked: false, level: 1, text: 'TailwindCSS' },
        { checked: false, level: 1, text: 'Material UI' },
        { checked: false, level: 1, text: 'ChackraUI' },
      ],
    },
    {
      name: 'react-form-fields-bootstrap',
      description: 'Officially maintained Bootstrap-style form fields pack for @saphe/react-form',
      keywords: ['typescript', 'react', 'form', 'bootstrap'],
      internalDependencies: ['react-form'],
    },
    {
      name: 'react-table',
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
        { text: 'Does pagination start at 1 or 0?' },
        { text: 'Do a performance analysis' },
        { text: 'Check if the code would be cleaner/faster using useReducer (probably)' },
        { text: 'Access column configuration through RenderCellProps' },
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
  ],
};

interface WorkspaceConfig {
  /** Name of the workspace */
  name: string;
  /** Name of the scope, prefixes all package names */
  scope: string;
  /** Workspace license name */
  license: string;
  /** Main author of the workspace */
  author: {
    email: string;
    name: string;
  };
  repository: {
    type: string;
    url: string;
  };
  /** Packages configuration */
  packages: PackageConfig[];
}

interface PackageConfig {
  name: string;
  description: string;
  keywords: string[];
  internalDependencies?: string[];
  features?: { icon: string; text: string }[];
  roadmap?: { checked?: boolean; text: string; level?: number }[];
  examples?: { title: string; href: string }[];
}

function makeDemoCode(packageName: string): void {
  const base = join(__dirname, 'packages', packageName);
  mkdirSync(join(base, 'src'));
  mkdirSync(join(base, 'tests'));

  writeFileSync(
    join(base, 'src', 'index.ts'),
    'export const add = (a: number, b: number): number => {\n  return a + b;\n};\n',
  );

  writeFileSync(
    join(base, 'tests', 'index.spec.ts'),
    "import { add } from '../src';\n\ndescribe('add', () => {\n  it('adds integers', () => {\n    expect(add(10, 5)).toBe(15);\n    expect(add(14, 9)).toBe(23);\n  });\n});\n",
  );
}

function makeTsConfigs(p: PackageConfig): void {
  const base = join(__dirname, 'packages', p.name);

  const getTsConfig = (type: 'cjs' | 'esm') =>
    `{\n  "extends": "../../tsconfig.settings.json",\n  "compilerOptions": {${
      type === 'esm' ? '\n    "module": "ES2015",' : ''
    }\n    "rootDir": "src",\n    "outDir": "dist/${type}",\n    "declarationDir": "dist/types",\n  },${
      p.internalDependencies
        ? `\n  "references": [${
            p.internalDependencies.map((dep) => `\n    { "path": "../${dep}" },`) ?? ''
          }\n  ],`
        : ''
    }\n  "include": ["src/**/*"],\n}\n`;

  writeFileSync(join(base, 'tsconfig.esm.json'), getTsConfig('esm'));
  writeFileSync(join(base, 'tsconfig.json'), getTsConfig('cjs'));
}

function makeReadme(p: PackageConfig): void {
  const path = join(__dirname, 'packages', p.name, 'README.md');
  const end = '<!-- END AUTO-GENERATED: Add custom documentation after this comment -->';

  let content = '';
  if (existsSync(path)) {
    content = readFileSync(path, { encoding: 'utf-8' });
    content = content.substr(content.indexOf(end) + end.length);
  }

  const stream = createWriteStream(path);
  const write = (text = '', n = 1) => stream.write(`${text}${'\n'.repeat(n)}`);
  const n = `@${workspace.scope}/${p.name}`;

  stream.once('open', () => {
    // Title
    write(`# ${n}`, 2);

    // Badges
    const sRoot = 'https://img.shields.io/';
    const gRoot = 'https://github.com/saphewilliam/saphe-packages/blob/main/';
    const s = '?style=flat-square';
    write(`[![NPM version](${sRoot}npm/v/${n}${s})](https://npmjs.com/${n})`);
    write(`[![License](${sRoot}npm/l/${n}${s})](${gRoot}LICENSE)`);
    write(
      `[![Bundle size](${sRoot}bundlephobia/minzip/${n}${s})](https://bundlephobia.com/package/${n})`,
    );
    write(
      `[![Pull requests welcome](${sRoot}badge/PRs-welcome-brightgreen.svg${s})](${gRoot}CONTRIBUTING.md)`,
    );
    write();

    // Description
    write(`${p.description}`, 2);

    // Features
    if (p.features && p.features.length > 0) {
      write('## Features', 2);
      p.features.map(({ icon: emoji, text: description }, i) =>
        write(`- ${emoji} ${description}${i + 1 === p.features?.length ? '.' : ','}`),
      );
      write();
    }

    // ToC
    write(`## Table of Contents`, 2);
    if (p.roadmap && p.roadmap.length > 0) write('- [Roadmap](#roadmap)');
    write('- [Getting Started](#getting-started)');
    if (p.examples && p.examples.length > 0) write('- [Examples](#examples)');

    write(toc(content).content);
    write();

    // Roadmap
    if (p.roadmap && p.roadmap.length > 0) {
      write('## Roadmap', 2);
      p.roadmap.map((item) =>
        write(`${' '.repeat((item.level ?? 0) * 2)}- [${item.checked ? 'x' : ' '}] ${item.text}`),
      );
      write();
    }

    // Getting Started
    write(`## Getting Started`, 2);
    write(
      `Install using yarn:\n\n\`\`\`sh\nyarn add ${n}\n\`\`\`\n\nor using npm:\n\n\`\`\`sh\nnpm install ${n}\n\`\`\``,
      2,
    );

    // Examples
    if (p.examples && p.examples.length > 0) {
      write('## Examples', 2);
      p.examples.map((example) => write(`- [${example.title}](${example.href})`));
      write();
    }

    write(end + content, 0);
    stream.end();
  });
}

function makePackageJson(p: PackageConfig): void {
  const path = join(__dirname, 'packages', p.name, 'package.json');

  let oldPackageJson;
  if (existsSync(path)) oldPackageJson = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));

  writeFileSync(
    path,
    JSON.stringify(
      {
        name: `@${workspace.scope}/${p.name}`,
        license: workspace.license,
        version: oldPackageJson?.version ?? '0.0.0',
        description: p.description,
        keywords: p.keywords,
        author: workspace.author,
        repository: { ...workspace.repository, directory: `packages/${p.name}` },
        homepage: `https://github.com/saphewilliam/saphe-packages/tree/main/packages/${p.name}#readme`,
        bugs: `https://github.com/saphewilliam/saphe-packages/issues?q=is%3Aopen+is%3Aissue+label%3Apackage%3A${p.name}`,
        sideEffects: false,
        publishConfig: { access: 'public' },
        main: 'dist/cjs/index.js',
        module: 'dist/esm/index.js',
        types: 'dist/types/index.d.ts',
        files: ['dist/'],
        scripts: {
          build: 'rimraf dist && tsc -b tsconfig.json tsconfig.esm.json',
          lint: 'eslint --ext .ts,.tsx . --fix --ignore-path ../../.eslintignore',
        },
        dependencies: oldPackageJson?.dependencies ?? {},
        devDependencies: oldPackageJson?.devDependencies ?? {},
        peerDependencies: oldPackageJson?.peerDependencies ?? {
          'react': '>=17.0.0',
          'react-dom': '>=17.0.0',
        },
      },
      null,
      2,
    ) + '\n',
  );
}

function main(): void {
  for (const p of workspace.packages) {
    const path = join(__dirname, 'packages', p.name);
    if (!existsSync(path)) {
      mkdirSync(path);
      makeDemoCode(p.name);
    }

    makeTsConfigs(p);
    makeReadme(p);
    makePackageJson(p);
  }
}

main();
