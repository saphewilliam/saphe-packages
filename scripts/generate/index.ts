import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { workspace } from '../../workspace';
import { makePackageJson } from './makePackageJson';
import { makeReadme, makeRootReadme } from './makeReadme';

export interface WorkspaceConfig {
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

export interface PackageConfig {
  name: string;
  description: string;
  keywords: string[];
  internalDependencies?: string[];
  peerDependencies?: string[];
  features?: { icon: string; text: string }[];
  roadmap?: { checked?: boolean; text: string; level?: number }[];
  examples?: { title: string; href: string }[];
}

function makeDemoCode(packageName: string): void {
  const base = join(process.cwd(), 'packages', packageName);
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

function makeRootTsconfig(): void {
  const path = join(process.cwd(), 'tsconfig.json');

  writeFileSync(
    path,
    `{\n  "extends": "./tsconfig.settings.json",\n  "compilerOptions": {\n    "jsx": "react",\n    "baseUrl": "packages",\n    "paths": {\n${workspace.packages
      .map(
        (p, i) =>
          `      "@${workspace.scope}/${p.name}/*": ["${p.name}/src/*"]${
            i < workspace.packages.length - 1 ? ',' : ''
          }\n`,
      )
      .join('')}    }\n  }\n}\n`,
  );
}

function makeTsconfigs(p: PackageConfig): void {
  const base = join(process.cwd(), 'packages', p.name);

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

function makeLabelerYml(): void {
  const path = join(process.cwd(), '.github', 'labeler.yml');
  const stream = createWriteStream(path);

  stream.once('open', () => {
    for (const p of workspace.packages) {
      stream.write(`package/${p.name}:\n  - packages/${p.name}/**/*\n`);
    }
  });
}

function main(): void {
  makeRootReadme();
  makeRootTsconfig();
  makeLabelerYml();

  for (const p of workspace.packages) {
    const path = join(process.cwd(), 'packages', p.name);
    if (!existsSync(path)) {
      mkdirSync(path);
      makeDemoCode(p.name);
    }

    makeTsconfigs(p);
    makeReadme(p);
    makePackageJson(workspace, p);
  }
}

main();
