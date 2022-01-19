# Contributing to the Saphe Package Ecosystem

If you're reading this, you're probably thinking of contributing to this open source project. That's great! Your input is very welcome 🎉

Contributing to the project can be done in multiple ways:

- Reporting bugs or other issues
- Proposing new features
- Implementing bug fixes or features

## Reporting Bugs or Feature Requests

To report a bug, issue, enhancement, or feature request, [submit an issue to this GitHub repository](https://github.com/saphewilliam/saphe-packages/issues/new/choose). When you create a new issue, you can select the appropriate issue template. From there, you can follow the steps in the template.

## Development Process

1. Fork the repo and clone it
2. Create a branch from `main` with the naming convention `(feature|bugfix|enhancement)/descriptive-branch-name` (e.g. feature/add-upload-field)
3. In the root directory (at the same directory level as this contributing guide), run `yarn` and `yarn build`

// TODO 4. `yarn link`

5. Run `yarn change` for each change that you make that should be added to the changelog
6. When you're done implementing your code, make sure that `yarn lint`, `yarn build` and `yarn test` pass without warnings or errors.
7. Create a [new pull request](https://github.com/saphewilliam/saphe-packages/compare) and select your branch in your forked repo as the compare branch.
