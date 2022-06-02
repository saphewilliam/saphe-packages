// import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
// import { join } from 'node:path';
import { packages } from '../../workspace';
// import { makePackageJson } from './makePackageJson';
// import { makeReadme, makeRootReadme } from './makeReadme';

export interface PackageConfig {
  description: string;
  keywords: string[];
  features?: { icon: string; text: string }[];
  roadmap?: { checked?: boolean; text: string; level?: number }[];
  examples?: { title: string; href: string }[];
}

export type Packages = {
  [packageName: string]: PackageConfig;
};

function main(): void {
  console.log(Object.keys(packages));
}

main();
