module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/.github/claude/tests/setup/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/apps/cms/src/$1',
    '^@repo/(.*)$': '<rootDir>/packages/$1',
  },
  testMatch: [
    '<rootDir>/.github/claude/tests/**/*.test.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'apps/cms/src/**/*.{ts,tsx}',
    'packages/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testTimeout: 10000,
};