# @saphe/react-forms

## 0.7.0

### Minor Changes

- 3075b0a: Added onChange void function to form config
- 3075b0a: Breaking! Changed submitbutton props
- 3075b0a: Expose internal state and actions through hook

### Patch Changes

- 3075b0a: Fixed bug where onSubmit would be called multiple times in development mode

## 0.6.1

### Patch Changes

- 071bcb8: Rewrite of form hook using useReducer
- 071bcb8: Support for multiple files in file field (experimental)

## 0.6.0

### Minor Changes

- a4e69c9: Fix internal state representation issues (BREAKING)
- a4e69c9: Added submit button options
- 96d9bff: Added Password, Email and File type fields
- 96d9bff: Improved null handling (BREAKING)
- f77ee4e: Code cleanup + Rename FormFieldContainer to `FieldContainer` (BREAKING!)
- a4e69c9: Expose separate submit button for external use

## 0.5.0

### Minor Changes

- 8c573c5: Fix naming inconsistencies (breaking)

## 0.4.0

### Minor Changes

- 0bf7402: Introduce basic form validation
- dde2199: Provide onError callback for recaptcha
- 2b9f8cf: Scale recaptcha badge down when viewing on smaller screens
- dde2199: FormValues type now takes required inputs into account

### Patch Changes

- 9e5a3fc: Improved default form styling

## 0.3.0

### Minor Changes

- 0748ffe: Update testing coverage
- d64485f: Complete restructure of the codebase
- 8365e75: Added describedBy prop to prevent code duplication

### Patch Changes

- 8263ef9: Readme and linting update

## 0.2.0

### Minor Changes

- 0e16428: Small code dump from previous repository
- 6a3fe10: Rename package from '@saphe/react-forms' to '@saphe/react-form'. Added documentation readme.

## 0.1.0

### Minor Changes

- a093a2c: Initialized monorepo structure with test suite

### Patch Changes

- Updated dependencies [a093a2c]
  - @saphe/core@0.1.0
