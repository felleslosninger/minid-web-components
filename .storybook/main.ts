import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/web-components-vite',
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },

  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      optimizeDeps: {
        include: ['storybook-dark-mode', '@storybook/web-components'],
      },
    });
  },
};
export default config;
