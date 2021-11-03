import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PackageConfig, WorkspaceConfig } from '.';

export function makePackageJson(w: WorkspaceConfig, p: PackageConfig): void {
  const path = join(process.cwd(), 'packages', p.name, 'package.json');

  let oldPackageJson;
  if (existsSync(path)) oldPackageJson = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));

  writeFileSync(
    path,
    JSON.stringify(
      {
        name: `@${w.scope}/${p.name}`,
        license: w.license,
        version: oldPackageJson?.version ?? '0.0.0',
        description: p.description,
        keywords: p.keywords,
        author: w.author,
        repository: { ...w.repository, directory: `packages/${p.name}` },
        homepage: `https://github.com/saphewilliam/saphe-packages/tree/main/packages/${p.name}#readme`,
        bugs: `https://github.com/saphewilliam/saphe-packages/labels/package%2F${p.name}`,
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
