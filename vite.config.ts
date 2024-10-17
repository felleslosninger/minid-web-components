import { defineConfig } from 'vite';
import { hmrPlugin, presets } from 'vite-plugin-web-components-hmr';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

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
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'MinID-Elements',
        formats: ['es'],
        fileName: 'index',
      },
    },
    rollupOptions: {
      // external: ['^lit$'],
    },
    plugins: [
      externalizeDeps(),
      dts({ rollupTypes: true }),
      hmrPlugin({
        include: ['./src/**/*.ts'],
        presets: [presets.lit],
      }),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
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
