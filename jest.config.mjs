/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^next/cache$': '<rootDir>/jest-mocks/next-cache.js',
    '^next/navigation$': '<rootDir>/jest-mocks/next-navigation.js',
    '^.*utils/authUtils$': '<rootDir>/jest-mocks/auth-utils.js',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    "<rootDir>/__tests__/**/*.[jt]s?(x)"
  ],
};
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
