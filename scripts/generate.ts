// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import toc from 'markdown-toc';
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { packages } from '../workspace';

export interface Package {
  description: string;
  keywords: string[];
  peerDependencies?: string[];
  features?: { icon: string; text: string }[];
  roadmap?: { checked?: boolean; text: string; level?: number }[];
  examples?: { title: string; href: string }[];
}

export type Packages = {
  [packageName: string]: Package;
};

function makeDemoCode(n: string): void {
  const base = join(process.cwd(), 'packages', n);
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

function makeTsConfig(n: string): void {
  const base = join(process.cwd(), 'packages', n);
  writeFileSync(
    join(base, 'tsconfig.json'),
    '{\n  "extends": "../../tsconfig.settings.json",\n  "include": ["src"]\n}\n',
  );
}

function makePackageJson(n: string, p: Package): void {
  const path = join(process.cwd(), 'packages', n, 'package.json');

  let oldPackageJson;
  if (existsSync(path)) oldPackageJson = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));

  writeFileSync(
    path,
    JSON.stringify(
      {
        name: `@saphe/${n}`,
        license: 'MIT',
        version: oldPackageJson?.version ?? '0.0.0',
        description: p.description,
        keywords: p.keywords,
        author: {
          email: 'william@saphewebdesign.com',
          name: 'William Ford',
        },
        repository: {
          type: 'git',
          url: 'https://github.com/saphewilliam/saphe-packages.git',
          directory: `packages/${n}`,
        },
        homepage: `https://github.com/saphewilliam/saphe-packages/tree/main/packages/${n}#readme`,
        bugs: `https://github.com/saphewilliam/saphe-packages/labels/@saphe%2F${n}`,
        sideEffects: false,
        publishConfig: { access: 'public' },
        main: 'dist/index.cjs.js',
        module: 'dist/index.es.js',
        types: 'dist/index.d.ts',
        files: ['dist/'],
        scripts: {
          dev: `jest -c ../../jest.config.js --testPathPattern /packages/${n}/ --watchAll`,
          lint: 'eslint --ext .ts,.tsx . --fix && tsc',
          build: 'vite build -c ../../vite.config.ts',
          test: `jest -c ../../jest.config.js --testPathPattern /packages/${n}/ --coverage --collectCoverageFrom packages/${n}/src/**/*.{ts,tsx} --coverageDirectory packages/${n}/.coverage`,
          clean: 'rimraf node_modules .turbo dist .coverage',
        },
        dependencies: { ...oldPackageJson?.dependencies },
        devDependencies: { ...oldPackageJson?.devDependencies },
        peerDependencies: {
          ...oldPackageJson?.peerDependencies,
          'react': '>=18.2.0',
          'react-dom': '>=18.2.0',
        },
      },
      null,
      2,
    ) + '\n',
  );
}

function makeReadme(name: string, p: Package): void {
  const path = join(process.cwd(), 'packages', name, 'README.md');
  const end = '<!-- END AUTO-GENERATED: Add custom documentation after this comment -->';

  let content = '';
  if (existsSync(path)) {
    content = readFileSync(path, { encoding: 'utf-8' });
    content = content.substring(content.indexOf(end) + end.length);
  }

  const stream = createWriteStream(path);
  const write = (text = '', n = 1) => stream.write(`${text}${'\n'.repeat(n)}`);
  const n = `@saphe/${name}`;

  stream.once('open', () => {
    // Title
    write(`# ${n}`, 2);

    // Badges
    const repo = '/saphewilliam/saphe-packages';
    const sRoot = 'https://img.shields.io/';
    const gRoot = `https://github.com${repo}/blob/main/`;
    const s = '?style=flat-square';
    write(`[![NPM version](${sRoot}npm/v/${n}${s})](https://npmjs.com/${n})`);
    write(`[![NPM downloads](${sRoot}npm/dt/${n}${s})](https://npmjs.com/${n})`);
    write(`[![License](${sRoot}npm/l/${n}${s})](${gRoot}LICENSE)`);
    write(
      `[![Bundle size](${sRoot}bundlephobia/minzip/${n}${s})](https://bundlephobia.com/package/${n})`,
    );
    write(
      `[![Dependencies](${sRoot}librariesio/release/npm/${n}${s})](https://libraries.io/npm/${encodeURIComponent(
        n,
      )}/)`,
    );
    write(
      `[![Code coverage](${sRoot}codecov/c/github${repo}${s}&flag=${name}&logo=codecov&token=62N8FTE2CV)](https://codecov.io/gh/saphewilliam/saphe-packages)`,
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
    write(toc(content).content, 2);

    // Roadmap
    if (p.roadmap && p.roadmap.length > 0) {
      write('## Roadmap', 2);
      p.roadmap.map((item) =>
        write(`${' '.repeat((item.level ?? 0) * 2)}- [${item.checked ? 'x' : ' '}] ${item.text}`),
      );
      write();
    }

    // Getting Started
    const install = [n, ...(p.peerDependencies ?? [])].join(' ');
    write(`## Getting Started`, 2);
    write(
      `Install using pnpm:\n\n\`\`\`sh\npnpm i ${install}\n\`\`\`\n\nor install using yarn:\n\n\`\`\`sh\nyarn add ${install}\n\`\`\`\n\nor install using npm:\n\n\`\`\`sh\nnpm install ${install}\n\`\`\``,
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

function makeLabelerYml(): void {
  const path = join(process.cwd(), '.github', 'labeler.yml');
  const stream = createWriteStream(path);

  stream.once('open', () => {
    for (const name of Object.keys(packages)) {
      stream.write(`'@saphe/${name}':\n  - packages/${name}/*\n  - packages/${name}/**/*\n`);
    }
  });
}

function makeCoverageYml(): void {
  const path = join(process.cwd(), '.github', 'actions', 'collect_coverage', 'action.yml');
  const stream = createWriteStream(path);

  stream.once('open', () => {
    stream.write(
      'name: "Collect coverage from all packages"\n\nruns:\n  using: "composite"\n  steps:',
    );
    for (const name of Object.keys(packages)) {
      stream.write(
        `\n    - name: Upload ${name} coverage to Codecov\n      uses: codecov/codecov-action@v2\n      with:\n        files: ./packages/${name}/.coverage/coverage-final.json\n        flags: ${name}\n`,
      );
    }
  });
}

function makeRootTsConfig(): void {
  const path = join(process.cwd(), 'tsconfig.json');

  writeFileSync(
    path,
    JSON.stringify(
      {
        extends: './tsconfig.settings.json',
        compilerOptions: {
          baseUrl: 'packages',
          paths: Object.keys(packages).reduce(
            (prev, curr) => ({ ...prev, [`@saphe/${curr}`]: [`${curr}/src`] }),
            {},
          ),
        },
      },
      null,
      2,
    ) + '\n',
  );
}

function makeRootReadme(): void {
  const path = join(process.cwd(), 'README.md');
  const start = '<!-- BEGIN AUTO-GENERATED PACKAGES TABLE -->';
  const end = '<!-- END AUTO-GENERATED PACKAGES TABLE -->';

  const content = readFileSync(path, { encoding: 'utf-8' });
  const startContent = content.substring(0, content.indexOf(start) + start.length);
  const endContent = content.substring(content.indexOf(end));

  const stream = createWriteStream(path);
  const write = (cols: string[]) => stream.write(`${cols.join('|')}\n`);

  stream.once('open', () => {
    stream.write(`${startContent}\n`);
    write(['name', 'version', 'description']);
    write(['-', '-', '-']);
    for (const [name, p] of Object.entries(packages)) {
      const n = `@saphe/${name}`;

      write([
        `\`${n}\``,
        `[![npm version](https://img.shields.io/npm/v/${n}.svg?style=flat)](https://www.npmjs.com/package/${n})`,
        p.description,
      ]);
    }

    stream.write(`${endContent}`);
  });
}

function main(): void {
  makeRootReadme();
  makeRootTsConfig();
  makeLabelerYml();
  makeCoverageYml();

  for (const [n, p] of Object.entries(packages)) {
    const path = join(process.cwd(), 'packages', n);
    if (!existsSync(path)) {
      mkdirSync(path);
      makeDemoCode(n);
    }

    makeTsConfig(n);
    makeReadme(n, p);
    makePackageJson(n, p);
  }
}

main();
