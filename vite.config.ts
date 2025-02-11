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
    path.resolve(__dirname, 'src/components/**/index.ts')
  );

  componentFiles.forEach((file) => {
    const name = path
      .relative(path.resolve(__dirname, 'src/components'), file)
      .replace(/\/index.ts$/, ''); // Get relative path and remove extension
    entries[`components/${name}`] = file; // Create entry with nested paths
  });

  const utilityFiles = glob.sync(
    path.resolve(__dirname, 'src/components/utilities/*.ts')
  );

  utilityFiles.forEach((file) => {
    console.log(entries);
    const name = path
      .relative(path.resolve(__dirname, 'src/components/utilities'), file)
      .replace(/\.ts$/, ''); // Get relative path and remove extension
    entries[`utilities/${name}`] = file; // Create entry with nested paths
  });

  const mixinFiles = glob.sync(path.resolve(__dirname, 'src/mixins/*.ts'));
  mixinFiles.forEach((file) => {
    const name = path
      .relative(path.resolve(__dirname, 'src/mixins'), file)
      .replace(/\.ts$/, ''); // Get relative path and remove extension
    entries[`utilities/${name}`] = file; // Create entry with nested paths
  });

  return entries;
};

// eslint-disable-next-line no-empty-pattern
export default defineConfig(({}) => {
  return {
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
    },
    rollupOptions: {
      external: ['^lit$'],
      input: () => {
        const entries = {};

        const componentFiles = glob.sync(
          path.resolve(__dirname, 'src/components/**')
        );

        componentFiles.forEach((file) => {
          const name = path
            .relative(path.resolve(__dirname, 'src/components'), file)
            .replace(/\.ts$/, ''); // Get relative path and remove extension
          entries[`components/${name}`] = file; // Create entry with nested paths
        });
        return entries;
      },
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        dir: 'dist',
        format: 'es',
        preserveModules: true,
        globals: {
          lit: 'Lit',
        },
      },
    },
    plugins: [
      externalizeDeps(),
      dts({ rollupTypes: true }),
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
