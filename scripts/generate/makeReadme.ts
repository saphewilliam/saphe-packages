import { createWriteStream, existsSync, readFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import toc from 'markdown-toc';
import { workspace } from '../../workspace';
import { PackageConfig } from '.';

export function makeReadme(p: PackageConfig): void {
  const path = join(process.cwd(), 'packages', p.name, 'README.md');
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
    const install = `${n}${p.peerDependencies?.map((dep) => ` ${dep}`) ?? ''}`;
    write(`## Getting Started`, 2);
    write(
      `Install using yarn:\n\n\`\`\`sh\nyarn add ${install}\n\`\`\`\n\nor using npm:\n\n\`\`\`sh\nnpm install ${install}\n\`\`\``,
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

export function makeRootReadme(): void {
  const path = join(process.cwd(), 'README.md');
  const start = '<!-- BEGIN AUTO-GENERATED PACKAGES TABLE -->';
  const end = '<!-- END AUTO-GENERATED PACKAGES TABLE -->';

  const content = readFileSync(path, { encoding: 'utf-8' });
  const startContent = content.substr(0, content.indexOf(start) + start.length);
  const endContent = content.substr(content.indexOf(end));

  const stream = createWriteStream(path);
  const write = (cols: string[]) => stream.write(`${cols.join('|')}\n`);

  stream.once('open', () => {
    stream.write(`${startContent}\n`);
    write(['name', 'version', 'description']);
    write(['-', '-', '-']);
    for (const p of workspace.packages) {
      const n = `@${workspace.scope}/${p.name}`;

      write([
        `\`${n}\``,
        `[![npm version](https://img.shields.io/npm/v/${n}.svg?style=flat)](https://www.npmjs.com/package/${n})`,
        p.description,
      ]);
    }

    stream.write(`${endContent}`);
  });
}
