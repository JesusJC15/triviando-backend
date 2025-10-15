module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFiles: ['dotenv/config'],
  detectOpenHandles: true,
  verbose: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151002], // 👈 Silencia esa advertencia
      },
    },
  },
};
