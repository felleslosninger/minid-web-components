import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig({ command: 'build', mode: '' }),
  defineConfig({
    test: {
      // Use `workspace` field in Vitest < 3.2
      projects: [
        {
          plugins: [
            storybookTest({
              // The location of your Storybook config, main.js|ts
              configDir: path.join(dirname, '.storybook'),
              // This should match your package.json script to run Storybook
              // The --ci flag will skip prompts and not open a browser
              storybookScript: 'yarn storybook --ci',
            }),
          ],
          test: {
            // Enable browser mode
            browser: {
              enabled: true,
              // Make sure to install Playwright
              provider: 'playwright',
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
            setupFiles: ['./.storybook/vitest.setup.ts'],
          },
        },
      ],
      coverage: {
        provider: 'istanbul', // or 'istanbul'
        reporter: ['text', 'html'],
        // Ensure these paths are correct and don't include generated/external files
        include: ['src/**/*.{ts,js,jsx,tsx}'], // Only include your source files
        exclude: [
          'src/**/*.stories.{ts,js,jsx,tsx}', // Exclude story files
          'src/**/*.test.{ts,js,jsx,tsx}', // Exclude test files
          'node_modules/',
          'dist/',
          '.storybook/',
          'vite.config.ts',
          'vitest.config.ts',
          'coverage/',
        ],
        all: true, // Set to true if you want to include files not hit by tests
      },
    },
  })
);
