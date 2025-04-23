import { defineConfig } from 'vite';
import { hmrPlugin, presets } from 'vite-plugin-web-components-hmr';
import path from 'path';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { glob } from 'glob';
import postcssLit from 'rollup-plugin-postcss-lit';

const generateEntries = () => {
  const entries = {};

  const componentFiles = glob.sync(
    path.resolve(__dirname, '**/*.component.ts')
  );

  componentFiles.forEach((file) => {
    const name = path
      .relative(path.resolve(__dirname, 'src/components'), file)
      .replace('.component.ts', ''); // Get relative path and remove extension
    entries[`components/${name}`] = file; // Create entry with nested paths
  });

  const utilityFiles = glob.sync(path.resolve(__dirname, 'src/utilities/*.ts'));

  utilityFiles.forEach((file) => {
    const name = path
      .relative(path.resolve(__dirname, 'src/utilities'), file)
      .replace('.ts', ''); // Get relative path and remove extension
    entries[`utilities/${name}`] = file; // Create entry with nested paths
  });

  const mixinFiles = glob.sync(path.resolve(__dirname, 'src/mixins/*.ts'));
  mixinFiles.forEach((file) => {
    const name = path
      .relative(path.resolve(__dirname, 'src/mixins'), file)
      .replace('.ts', ''); // Get relative path and remove extension
    entries[`mixins/${name}`] = file; // Create entry with nested paths
  });

  const internalFiles = glob.sync(path.resolve(__dirname, 'src/internal/*.ts'));
  internalFiles.forEach((file) => {
    const name = path
      .relative(path.resolve(__dirname, 'src/internal'), file)
      .replace('.ts', ''); // Get relative path and remove extension
    entries[`internal/${name}`] = file; // Create entry with nested paths
  });

  entries['index'] = path.resolve(__dirname, 'src/index.ts');

  return entries;
};

// eslint-disable-next-line no-empty-pattern
export default defineConfig(({}) => {
  return {
    publicDir: 'src/public',
    build: {
      minify: false,
      cssCodeSplit: true,
      cssMinify: false,
      target: 'es2021',
      sourcemap: true,
      emptyOutDir: true,
      lib: {
        entry: generateEntries(),

        name: 'MinID-Elements',
        formats: ['es'],
        fileName: (_format, entryName) => `${entryName}.js`,
      },
      rollupOptions: {
        output: {
          globals: {
            lit: 'Lit',
          },
        },
      },
    },
    plugins: [
      externalizeDeps(),
      dts(),
      hmrPlugin({
        include: ['./src/**/*.ts'],
        presets: [presets.lit],
      }),
      postcssLit(),
    ],
    resolve: {
      alias: {
        src: '/src',
        components: '/src/components',
        internal: '/src/internal',
        mixins: '/src/mixins',
        css: '/src/css',
      },
    },
  };
});
