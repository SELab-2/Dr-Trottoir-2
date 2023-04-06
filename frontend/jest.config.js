// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // modulePathIgnorePatterns: ['<rootDir>/usr'],
  collectCoverage: true,
  coverageDirectory: "src",
  collectCoverageFrom: [
    "./src/components/**",
    "./src/pages/**",
    "./src/services/**",
  ],
  testEnvironment: "jest-environment-jsdom",
  coverageThreshold: {
    global: {
      // ideally this will need to be 90%
      lines: 20,
    },
  },

  //ChatGPT suggested this fix. It seems to work, but more testing is needed.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
