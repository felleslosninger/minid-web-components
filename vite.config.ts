import { defineConfig } from 'vite';
import { hmrPlugin, presets } from 'vite-plugin-web-components-hmr';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';

export default defineConfig(({}) => {

  return {
    build: {
      target: 'esnext',
      rollupOptions: {
        external: ['lit', 'tailwindcss'],
        output: {
          globals: {
            lit: 'Lit',
            tailwindcss: 'tailwindcss',
          },
        },
      },
      sourcemap: true,
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, 'lib/index.ts'),
        name: 'MinID-Elements',
        formats: ['es'],
        fileName: 'minid-elements',
      },
    },
    plugins: [
      //dts({ rollupTypes: true }), // mixins and errors... TS4094: Property '__enqueueUpdate' of exported anonymous class type may not be private or protected.
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
        src: '/lib',
        components: '/lib/components',
        internal: '/lib/internal',
        mixins: '/lib/mixins',
        css: '/lib/css',
      },
    },
  };
});