export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "warn",
      "no-duplicate-case": "error",
      "no-dupe-keys": "error",
      "no-unreachable": "error",
      "no-constant-condition": "warn",
      "no-empty": "warn",
      "no-extra-semi": "error",
      "no-func-assign": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-sparse-arrays": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      "eqeqeq": "warn",
      "no-eval": "error",
      "no-implied-eval": "error",
    },
  },
];
