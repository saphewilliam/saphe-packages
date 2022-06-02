# Contributing to the Saphe Package Ecosystem

If you're reading this, you're probably thinking of contributing to this open source project. That's great! Your input is very welcome 🎉

Contributing to the project can be done in multiple ways:

- Reporting bugs or other issues
- Proposing new features
- Implementing bug fixes or features

## Reporting Bugs or Feature Requests

To report a bug, issue, enhancement, or feature request, [submit an issue to this GitHub repository](https://github.com/saphewilliam/saphe-packages/issues/new/choose). When you create a new issue, you can select the appropriate issue template. From there, you can follow the steps in the template.

## Recommended Tools and Knowledge

- Tools: [pnpm](https://pnpm.io/) and [git](https://git-scm.com/)
- Development with [React](https://reactjs.org/docs/getting-started.html) and [Typescript](https://www.typescriptlang.org/docs/)
- Test-driven development with [Jest](https://jestjs.io/docs/getting-started) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Development Process

1. Fork the repo and clone it
2. Create a branch from `main` with the naming convention `(feature|fix|chore)/descriptive-branch-name` (e.g. `git checkout -b feature/add-upload-field`)
3. In the root directory (at the same level as this contributing guide), run `pnpm i`
4. You can use the commands `pnpm lint`, `pnpm test`, and `pnpm dev` during development. The commmand `pnpm dev` runs tests in watch mode, because we practice development test-driven.
5. Run `pnpm change` for each change that you make that should be added to the changelog
6. When you're done implementing your code, make sure that `pnpm lint`, `pnpm test` and `pnpm build` pass without unintended warnings or errors.
7. Create a [new pull request](https://github.com/saphewilliam/saphe-packages/compare) and select your branch in your forked repo as the compare branch.
