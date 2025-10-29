// Minimal ESLint flat config for this TypeScript project.
// Uses @typescript-eslint parser and plugin with a small set of useful rules.
module.exports = {
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      project: false
    }
  },
  plugins: {
    "@typescript-eslint": require("@typescript-eslint/eslint-plugin")
  },
  rules: {
    // keep console logs allowed for server-side debugging; change to 'warn' or 'error' if desired
    "no-console": "off",
    // prefer const where possible
    "prefer-const": "warn",
    // use TypeScript-aware unused-vars rule: ignore variables/args that start with _
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }]
  },
  ignores: ["dist/**", "node_modules/**", "coverage/**"]
};
