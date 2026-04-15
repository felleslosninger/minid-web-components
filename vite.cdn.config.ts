import { defineConfig } from 'vite';
import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line no-empty-pattern
export default defineConfig(({}) => {
  // Determine the directory name, supporting both CommonJS (__dirname) and ES Modules (import.meta.url)
  const dirname =
    typeof __dirname !== 'undefined'
      ? __dirname
      : path.dirname(fileURLToPath(import.meta.url));

  const entryPaths = [
    ...globSync('src/index.ts', { cwd: dirname }),
    ...globSync('src/**/*.component.ts', { cwd: dirname }),
  ];

  return {
    build: {
      minify: 'esbuild',
      cssCodeSplit: true,
      cssMinify: 'esbuild',

      target: 'es2021',
      sourcemap: false,
      emptyOutDir: true,
      outDir: 'dist-cdn',

      lib: {
        entry: entryPaths,
        name: 'MinID-Elements',
        formats: ['es'],
        fileName: (_format, entryName) =>
          `${entryName.replace(/\.component$/, '')}.js`,
      },
    },

    rollupOptions: {
      output: {
        preserveModules: true,
      },
    },

    plugins: [],

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
