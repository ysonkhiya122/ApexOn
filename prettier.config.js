/** @type {import("prettier").Config} */
export default {
  // The codebase is written with semicolons throughout; the previous
  // `semi: false` meant `format:check` failed on 148 files and running
  // `format` would have rewritten every line in the repo.
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
};
