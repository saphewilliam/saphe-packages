module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
    'react': {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist', 'node_modules', '.turbo', '.coverage'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
