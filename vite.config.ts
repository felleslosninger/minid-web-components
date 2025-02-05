import { defineConfig } from 'vite';
import { hmrPlugin, presets } from 'vite-plugin-web-components-hmr';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { glob } from 'glob';
import postcssLit from 'rollup-plugin-postcss-lit';

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
        entry: glob.sync([
          resolve(__dirname, 'src/{**/*.component.ts,index.ts}'),
          resolve(__dirname, 'src/styles/designsystemet-tailwind.css'),
        ]),
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
