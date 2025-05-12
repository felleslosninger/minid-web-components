import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';
//import * as path from 'node:path';

// eslint-disable-next-line no-empty-pattern
export default defineConfig(({}) => {
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
        entry: glob.sync([
          resolve(__dirname, 'src/{**/*.component.ts,index.ts}'),
          resolve(__dirname, 'src/styles/designsystemet-tailwind.css'),
        ]),
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
