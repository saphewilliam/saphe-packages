module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  modulePathIgnorePatterns: ['dist', 'node_modules'],
  testPathIgnorePatterns: ['dist', 'node_modules'],
  // collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  // coverageDirectory: '.coverage',
};
