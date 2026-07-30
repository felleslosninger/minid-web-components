import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import storybook from 'eslint-plugin-storybook';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'dist-cdn/',
      'storybook-static/',
      'design-tokens-build/',
      'coverage/',
      'custom-elements.json',
      // Dev/demo playgrounds: their `src` are symlinks back to ../src, which is
      // already linted directly. `dev/tailwind.config.ts` is also a dangling
      // symlink (left over from the Tailwind 4 migration) that eslint fails on.
      'dev/',
      'demo/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.browser, __dirname: 'readonly' },
    },
    rules: {
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // typescript-eslint v8 split `ban-types` into these three. The previous
      // .eslintrc.json set `ban-types: 'off'`, so keep the successors off too.
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-restricted-types': 'off',

      // Components deliberately use `cond && fn()` and `cond ? a() : b()` to
      // trigger side effects; both are opted into rather than disabling the rule,
      // so genuine dead expressions (e.g. a stray comma operator) still error.
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],

      // New in eslint 9's recommended set. The codebase defensively initialises
      // (`let x = 0`) before assigning in every branch, which this flags. Warn
      // so it stays visible without failing the build over an existing idiom.
      'no-useless-assignment': 'warn',
    },
  }
);
