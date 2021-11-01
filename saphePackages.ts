import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { readFile, writeFile } from 'jsonfile';

const workspace: WorkspaceConfig = {
  name: 'saphe-packages',
  scope: 'saphe',
  license: 'MIT',
  packages: [
    {
      name: 'react-form',
      description: 'A lightweight, declarative, type-safe form engine for React apps.',
      keywords: ['typescript', 'react', 'hook', 'form', 'validation'],
    },
    {
      name: 'react-form-fields-bootstrap',
      description: 'Bootstrap-style officially maintained form fields pack for @saphe/react-form',
      keywords: ['typescript', 'react', 'form', 'bootstrap'],
      internalDependencies: ['react-form'],
    },
    {
      name: 'hello-world',
      description: 'This is just a test package',
      keywords: ['test', 'package'],
    },
    {
      name: 'react-table',
      description: 'A lightweight, declarative, type-safe table engine for React apps.',
      keywords: ['typescript', 'react', 'hook', 'table', 'tables'],
      features: [
        {
          emoji: '✅',
          description: 'CommonJS and ES Modules support',
        },
        {
          emoji: '🤩',
          description: 'Easily sort by columns',
        },
        {
          emoji: '⏭️',
          description: 'Built-in pagination logic',
        },
        {
          emoji: '🔍',
          description: 'Exact and fuzzy text search with match highlighting out-of-the-box',
        },
        {
          emoji: '👁️',
          description: 'Toggle visibility on columns using the provided utility functions',
        },
        {
          emoji: '⚖️',
          description:
            'Lightweight; [6.3 kB minified + gzipped](https://bundlephobia.com/package/@saphe/react-table) (esm and cjs combined) and only 2 dependencies total',
        },
        {
          emoji: '🚀',
          description: 'Efficient due to usage of internal memoization and effect order',
        },
        {
          emoji: '🎨',
          description: 'Headless; you decide the table style, the hook handles the logic',
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
  /** Packages configuration */
  packages: PackageConfig[];
}

interface PackageConfig {
  name: string;
  description: string;
  keywords: string[];
  internalDependencies?: string[];
  features?: { emoji: string; description: string }[];
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

function makeTsConfigs(packageName: string, dependencies?: string[]): void {
  const base = join(__dirname, 'packages', packageName);

  const getTsConfig = (type: 'cjs' | 'esm') =>
    `{\n  "extends": "../../tsconfig.settings.json",\n  "compilerOptions": {${
      type === 'esm' ? '\n    "module": "ES2015",' : ''
    }\n    "rootDir": "src",\n    "outDir": "dist/${type}",\n    "declarationDir": "dist/types",\n  },${
      dependencies
        ? `\n  "references": [${
            dependencies.map((dep) => `\n    { "path": "../${dep}" },`) ?? ''
          }\n  ],`
        : ''
    }\n  "include": ["src/**/*"],\n}\n`;

  writeFileSync(join(base, 'tsconfig.esm.json'), getTsConfig('esm'));
  writeFileSync(join(base, 'tsconfig.json'), getTsConfig('cjs'));
}

function makeReadme(p: PackageConfig): void {
  const stream = createWriteStream(join(__dirname, 'packages', p.name, 'README.md'));
  const n = `@${workspace.scope}/${p.name}`;

  stream.once('open', () => {
    // Title
    stream.write(`# ${n}\n\n`);

    // Badges
    const sRoot = 'https://img.shields.io/';
    const gRoot = 'https://github.com/saphewilliam/saphe-packages/blob/main/';
    const s = '?style=flat-square';
    stream.write(`[![NPM version](${sRoot}npm/v/${n}${s})](https://npmjs.com/${n})\n`);
    stream.write(`[![License](${sRoot}npm/l/${n}${s})](${gRoot}LICENSE)\n`);
    stream.write(
      `[![Bundle size](${sRoot}bundlephobia/minzip/${n}${s})](https://bundlephobia.com/package/${n})\n`,
    );
    stream.write(
      `[![Pull requests welcome](${sRoot}/badge/PRs-welcome-brightgreen.svg${s})]${gRoot}CONTRIBUTING.md)\n`,
    );

    // Description
    stream.write(`\n${p.description}\n\n`);

    // Features
    if (p.features && p.features !== []) stream.write('## Features\n\n');
    p.features?.map(({ emoji, description }, i) =>
      stream.write(`- ${emoji} ${description}${i + 1 === p.features?.length ? '.' : ','}`),
    );

    // ToC

    // Roadmap

    stream.end();
  });
}

function main(): void {
  for (const p of workspace.packages) {
    const path = join(__dirname, 'packages', p.name);
    if (!existsSync(path)) {
      mkdirSync(path);
      makeDemoCode(p.name);
    }

    makeTsConfigs(p.name, p.internalDependencies);
  }
}

main();
