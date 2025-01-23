import { defineConfig } from 'vite';
import { hmrPlugin, presets } from 'vite-plugin-web-components-hmr';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
// @ts-expect-error lolwhat
import tailwindcss from '@tailwindcss/vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { glob } from 'glob';

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
        entry: glob.sync(
          resolve(__dirname, 'src/{**/*.component.ts,index.ts}')
        ),
        name: 'MinID-Elements',
        formats: ['es'],
        fileName: (_format, entryName) => `${entryName}.js`,
      },
    },
    rollupOptions: {
      external: ['^lit$'],
      output: {
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
      tailwindcss(),
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
