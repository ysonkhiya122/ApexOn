import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // `any` is the failure mode that let the empty-hero bug ship: the hero
      // read `nextRace.raceName` on a value the adapter normalizes to `name`.
      // Warn everywhere, with a view to promoting this to an error.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
    },
  },

  // Node-side config files
  {
    files: ['*.config.{js,ts}', 'vite.config.ts', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },

  // Pit-wall radio is raw audio; the upstream feed publishes no caption or
  // transcript track, so a <track> element would be an empty promise.
  {
    files: ['src/modules/radio/**/*.tsx'],
    rules: { 'jsx-a11y/media-has-caption': 'off' },
  },

  // Tests
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  }
);
